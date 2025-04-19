import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { fetchTopicNotes } from '../../api/supabase';
import { sendChatMessage, getAvailableModels } from '../../api/openrouter';
import { supabase } from '../../api/supabase';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const StudyPage = () => {
  const { subject, topic } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [userNotes, setUserNotes] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userLevel, setUserLevel] = useState('');
  const [credits, setCredits] = useState(0);
  
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    // Load user level from localStorage or settings
    const level = localStorage.getItem('userLevel') || 'IGCSE';
    setUserLevel(level);
    
    // Get available models
    const models = getAvailableModels();
    setAvailableModels(models);
    setSelectedModel(models.find(model => model.isDefault)?.id || models[0].id);
    
    // Record start time for tracking study duration
    setStartTime(new Date());
    
    // Fetch user credits
    const fetchUserCredits = async () => {
      try {
        const { data, error } = await supabase
          .from('credits')
          .select('amount, is_unlimited')
          .eq('user_id', user.id)
          .gt('expiry_date', new Date().toISOString());
          
        if (error) throw error;
        
        // Calculate total credits
        const totalCredits = data.reduce((sum, credit) => {
          if (credit.is_unlimited) return Infinity;
          return sum + credit.amount;
        }, 0);
        
        setCredits(totalCredits);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };
    
    // Fetch notes for the selected topic
    const loadNotes = async () => {
      try {
        setLoading(true);
        const topicNotes = await fetchTopicNotes(subject, topic, level);
        setNotes(topicNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
        setErrorMessage("Failed to load notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCredits();
    loadNotes();
    
    // Cleanup function to record study session when component unmounts
    return () => {
      if (startTime && !showQuiz) {
        recordStudySession();
      }
    };
  }, [subject, topic, user.id]);
  
  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  const recordStudySession = async () => {
    const endTime = new Date();
    const durationMinutes = Math.round((endTime - startTime) / 60000);
    
    // Minimum duration to record (15 seconds)
    if (durationMinutes < 0.25) return;
    
    // Save study session data to database
    try {
      await supabase.from('study_sessions').insert({
        user_id: user.id,
        subject,
        topic,
        duration_minutes: durationMinutes,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        level: userLevel
      });
    } catch (error) {
      console.error("Error recording study session:", error);
    }
  };
  
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatLoading(true);
    setErrorMessage('');
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      // Create context-aware message with previous chat history
      const contextMessage = `I'm studying ${subject} (${topic}) at ${userLevel} level. ${
        chatMessages.length > 0 
          ? `Our previous conversation: ${chatMessages
              .map(msg => `${msg.role === 'user' ? 'Me' : 'You'}: ${msg.content}`)
              .join('\n')}\n\n` 
          : ''
      }My question: ${userMessage}`;
      
      // Send to API
      const response = await sendChatMessage(user.id, contextMessage, selectedModel);
      
      // Add AI response to chat
      const assistantMessage = response.choices?.[0]?.message?.content || 
                               "I couldn't generate a proper response. Please try again.";
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantMessage 
      }]);
      
      // Update credits after usage
      const modelInfo = availableModels.find(m => m.id === selectedModel);
      if (modelInfo && credits !== Infinity) {
        setCredits(prev => prev - modelInfo.creditUsage);
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
      setErrorMessage(error.message || "Failed to send message. Please try again.");
      
      // Add error message to chat
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${error.message || "Unknown error"}. Please try again later.` 
      }]);
    } finally {
      setChatLoading(false);
    }
  };
  
  const handleFinishStudying = async () => {
    // Record study session before starting quiz
    await recordStudySession();
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Check if user has enough credits for quiz generation
      if (credits < 2 && credits !== Infinity) {
        throw new Error('Not enough credits to generate a quiz. You need at least 2 credits.');
      }
      
      // Create quiz generation message
      const quizPrompt = `Create a 5-question multiple-choice quiz for ${userLevel} level ${subject} on the topic "${topic}". For each question, provide 4 options with only one correct answer. Also include a brief explanation for each correct answer that will help the student understand the concept better. Format the response as a JSON object with a "questions" array, where each question has "question", "options" (array), "correctAnswer" (one of the options), and "explanation" fields.`;
      
      // Generate quiz using the most basic model to save credits
      const basicModel = availableModels.find(m => m.creditUsage === 1)?.id || selectedModel;
      const quizResponse = await sendChatMessage(user.id, quizPrompt, basicModel);
      
      // Parse quiz content
      let quizContent;
      try {
        // Try to parse as JSON first
        const responseText = quizResponse.choices?.[0]?.message?.content || '';
        quizContent = JSON.parse(responseText);
      } catch (parseError) {
        // If parsing fails, try to extract JSON from markdown/text
        const responseText = quizResponse.choices?.[0]?.message?.content || '';
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                         responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                         responseText.match(/{[\s\S]*}/);
                         
        if (jsonMatch) {
          quizContent = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          throw new Error('Failed to parse quiz data from AI response');
        }
      }
      
      // Update quiz state and show quiz view
      setQuiz(quizContent);
      setShowQuiz(true);
      
      // Update credits after usage (quiz costs 2 credits)
      if (credits !== Infinity) {
        setCredits(prev => prev - 2);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      setErrorMessage(error.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuizAnswer = (questionIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };
  
  const handleSubmitQuiz = () => {
    // Check if all questions are answered
    if (Object.keys(quizAnswers).length < quiz.questions.length) {
      setErrorMessage("Please answer all questions before submitting.");
      return;
    }
    
    // Calculate results
    const results = quiz.questions.map((question, index) => {
      const userAnswer = quizAnswers[index];
      const correctAnswer = question.correctAnswer;
      return {
        question: question.question,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer,
        explanation: question.explanation
      };
    });
    
    const score = results.filter(r => r.isCorrect).length;
    const totalQuestions = results.length;
    
    setQuizResults({
      score,
      totalQuestions,
      percentage: (score / totalQuestions) * 100,
      results
    });
    
    // Record quiz results in database
    try {
      supabase.from('quiz_results').insert({
        user_id: user.id,
        subject,
        topic,
        level: userLevel,
        score,
        total_questions: totalQuestions,
        results: JSON.stringify(results)
      });
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  };
  
  const handleBackToSubjects = () => {
    navigate('/my-subjects');
  };
  
  const handleSaveNotes = async () => {
    try {
      const { error } = await supabase.from('user_notes').upsert({
        user_id: user.id,
        subject,
        topic,
        content: userNotes,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id, subject, topic'
      });
      
      if (error) throw error;
      
      alert('Your notes have been saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    }
  };
  
  // Display the quiz if it's active
  if (showQuiz) {
    return (
      <div className="flex flex-col w-full h-screen bg-white p-6">
        <h1 className="text-2xl font-bold mb-4">Quiz: {topic}</h1>
        
        {quizResults ? (
          <div className="quiz-results">
            <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
            <p className="text-lg mb-4">Score: {quizResults.score}/{quizResults.totalQuestions} ({quizResults.percentage.toFixed(1)}%)</p>
            
            <div className="space-y-6">
              {quizResults.results.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium mb-2">Question {index + 1}: {result.question}</p>
                  <p className="mb-1">Your answer: {result.userAnswer}</p>
                  <p className="mb-2">Correct answer: {result.correctAnswer}</p>
                  {!result.isCorrect && (
                    <p className="text-gray-700 italic">Explanation: {result.explanation}</p>
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleBackToSubjects} 
              className="mt-6"
            >
              Return to My Subjects
            </Button>
          </div>
        ) : (
          <div className="quiz-questions">
            {quiz.questions.map((question, index) => (
              <div key={index} className="mb-6 p-4 border rounded-lg">
                <p className="font-medium mb-3">Question {index + 1}: {question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center">
                      <input
                        type="radio"
                        id={`q${index}-opt${optIndex}`}
                        name={`question-${index}`}
                        value={option}
                        checked={quizAnswers[index] === option}
                        onChange={() => handleQuizAnswer(index, option)}
                        className="mr-2"
                      />
                      <label htmlFor={`q${index}-opt${optIndex}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}
            
            <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
          </div>
        )}
      </div>
    );
  }
  
  // Display main study page
  return (
    <div className="flex flex-row h-screen w-full">
      {/* Left panel - Ramsey AI helper */}
      <div className="w-1/4 h-full bg-gray-50 p-4 border-r flex flex-col">
        <h2 className="text-xl font-bold mb-2">Ramsey AI Helper</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select AI Model:</label>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.creditUsage} credit{model.creditUsage > 1 ? 's' : ''})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Credits available: {credits === Infinity ? 'Unlimited' : credits}
          </p>
          
          {selectedModel && (
            <p className="text-xs text-gray-500 mt-1">
              {availableModels.find(m => m.id === selectedModel)?.description}
            </p>
          )}
        </div>
        
        <div className="flex-grow overflow-y-auto mb-4 border rounded bg-white p-3">
          {chatMessages.length === 0 ? (
            <div className="text-gray-500 text-center mt-6">
              <p>Ask Ramsey for help with your studies!</p>
              <p className="text-sm mt-2">Example: "Explain photosynthesis simply" or "Make flashcards on this topic"</p>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 ml-4' : 'bg-gray-100 mr-4'}`}
              >
                <p className="text-sm font-medium mb-1">{msg.role === 'user' ? 'You' : 'Ramsey'}</p>
                <p>{msg.content}</p>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
        
        {errorMessage && (
          <div className="text-red-500 mb-2 text-sm">{errorMessage}</div>
        )}
        
        <div className="flex">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Ramsey for help..."
            className="flex-grow rounded-l border border-gray-300 p-2"
            onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
            disabled={chatLoading || credits === 0}
          />
          <Button 
            onClick={handleSendChat} 
            disabled={chatLoading || !chatInput.trim() || credits === 0} 
            className="rounded-l-none"
          >
            {chatLoading ? <Spinner size="sm" /> : 'Send'}
          </Button>
        </div>
      </div>
      
      {/* Center panel - Subject Notes */}
      <div className="w-2/4 h-full overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">{subject}</h1>
                <h2 className="text-xl">{topic}</h2>
                <p className="text-sm text-gray-500">{userLevel} Level</p>
              </div>
              <Button 
                onClick={handleFinishStudying}
                disabled={credits < 2 && credits !== Infinity}
              >
                Finish & Take Quiz
              </Button>
            </div>
            
            <div className="prose max-w-none">
              {notes ? (
                <div dangerouslySetInnerHTML={{ __html: notes }} />
              ) : (
                <p>No notes available for this topic. Try selecting another topic or contact support.</p>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Right panel - User Notes */}
      <div className="w-1/4 h-full bg-gray-50 p-4 border-l">
        <h2 className="text-xl font-bold mb-4">Your Notes</h2>
        <textarea
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Take your own notes here..."
          className="w-full h-3/4 border rounded p-3 resize-none"
        />
        <div className="mt-4 text-right">
          <Button onClick={handleSaveNotes}>
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudyPage;