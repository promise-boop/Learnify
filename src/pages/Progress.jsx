import { useState, useEffect, useRef } from 'react';
import { Send, FileText, Loader, AlertCircle } from 'lucide-react';
import Button from '../../common/Button';
import { useCredits } from '../../../hooks/useCredits';
import { useOpenRouter } from '../../../hooks/useOpenRouter';

const models = [
  {
    id: 'reka-flash-3',
    name: 'Reka Flash 3',
    description: 'Default model. Fast responses with lower credit usage.',
    creditsPerMessage: 5,
    apiId: 'reka/reka-flash-3'
  },
  {
    id: 'google-learnlm',
    name: 'Google LearnLM 1.5 Pro',
    description: 'Education-specialized model with deeper knowledge. Higher credit usage.',
    creditsPerMessage: 15,
    apiId: 'google/learnlm-1.5-pro:experimental'
  },
  {
    id: 'nvidia-nemotron',
    name: 'NVIDIA Nemotron 253B',
    description: 'Advanced large model with comprehensive capabilities. Highest credit usage.',
    creditsPerMessage: 30,
    apiId: 'nvidia/nemotron-253b:free'
  }
];

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Ramsey, your learning assistant. How can I help with your studies today? You can ask me to explain concepts, create study notes, or generate quizzes on any topic!",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [error, setError] = useState(null);
  
  const { credits, useCredits } = useCredits();
  const { sendMessage } = useOpenRouter();
  
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleModelChange = (modelId) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (loading) return;
    
    // Check if user has enough credits
    if (credits < selectedModel.creditsPerMessage) {
      setError('You don\'t have enough credits to use this model. Please purchase more credits or switch to a model with lower credit usage.');
      return;
    }
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    
    try {
      // Deduct credits
      await useCredits(selectedModel.creditsPerMessage);
      
      // Send message to API
      const response = await sendMessage(selectedModel.apiId, input.trim());
      
      // Add assistant response
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
        }
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      
      // Refund credits on error
      await useCredits(-selectedModel.creditsPerMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Model Selection */}
      <div className="bg-gray-50 p-4 border-b">
        <h3 className="font-medium mb-2">Select AI Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {models.map((model) => (
            <div 
              key={model.id}
              onClick={() => handleModelChange(model.id)}
              className={`
                border rounded-lg p-3 cursor-pointer transition-all
                ${selectedModel.id === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
              `}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">{model.name}</h4>
                <span className="text-sm font-medium text-blue-600">{model.creditsPerMessage} credits</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{model.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            You have <span className="font-medium">{credits}</span> credits available
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/credits'}
          >
            Get More Credits
          </Button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-3/4 rounded-lg p-3 
                ${message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'}
              `}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3 flex items-center space-x-2">
              <Loader className="animate-spin" size={16} />
              <span>Ramsey is thinking...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-700 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-grow relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Ramsey anything..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button 
                type="button"
                className="text-gray-400 hover:text-gray-600"
                title="Upload file (Coming soon)"
                disabled
              >
                <FileText size={18} />
              </button>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="rounded-full w-10 h-10 flex items-center justify-center"
            disabled={loading || !input.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          This will use {selectedModel.creditsPerMessage} credits from your account
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;