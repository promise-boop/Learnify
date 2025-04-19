import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { sendChatMessage, getAvailableModels } from '../api/openrouter';
import { useCredits } from '../hooks/useCredits';
import Button from '../components/common/Button';
import { supabase } from '../api/supabase';

const ChatbotPage = () => {
  const { user } = useAuth();
  const { userCredits, checkCredits, subtractCredits } = useCredits();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I\'m Ramsey, your AI learning assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('rekaai/reka-flash-3:free');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Get available models on component mount
  useEffect(() => {
    setModels(getAvailableModels());
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Find selected model details
      const modelDetails = models.find(model => model.id === selectedModel);
      const requiredCredits = modelDetails?.creditUsage || 1;

      // Check if user has enough credits
      const hasEnoughCredits = await checkCredits(requiredCredits);
      
      if (!hasEnoughCredits) {
        setError('You don\'t have enough credits to use this model. Please purchase more credits or select a different model.');
        setIsLoading(false);
        return;
      }

      // Send message to AI
      const response = await sendChatMessage(user.id, input, selectedModel);
      
      // Subtract credits used
      await subtractCredits(requiredCredits, 'chatbot', selectedModel);
      
      // Add AI response to messages
      if (response && response.choices && response.choices[0]) {
        const aiMessage = { 
          role: 'assistant', 
          content: response.choices[0].message.content 
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Record chat history in database
  useEffect(() => {
    const recordChatHistory = async () => {
      if (messages.length <= 1 || !user) return;
      
      try {
        await supabase.from('chat_history').insert({
          user_id: user.id,
          messages: messages,
          model: selectedModel,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error recording chat history:', err);
      }
    };
    
    recordChatHistory();
  }, [messages.length]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between bg-white shadow-sm p-4 border-b">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-center text-blue-600">Chat with Ramsey</h1>
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">Credits: {userCredits?.amount || 0}</span>
        </div>
      </div>

      <div className="p-4 bg-white shadow-sm mb-4">
        <div className="mb-2 text-gray-700 font-medium">Select AI Model:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {models.map((model) => (
            <div 
              key={model.id} 
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedModel === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{model.name}</h3>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {model.creditUsage} {model.creditUsage === 1 ? 'credit' : 'credits'}/msg
                </span>
              </div>
              <p className="text-sm text-gray-500">{model.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3/4 p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <textarea
            className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="2"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Send</span>
            )}
          </Button>
        </form>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Using {models.find(m => m.id === selectedModel)?.name || 'Ramsey AI'} • 
          {models.find(m => m.id === selectedModel)?.creditUsage || 1} credits per message
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;