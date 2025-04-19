const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Credit usage per model
const MODEL_CREDIT_USAGE = {
  'reka-flash-3': 1,
  'google/learnlm-1.5-pro:experimental': 3,
  'nvidia/nemotron-253b:free': 5
};

export const getAvailableModels = () => {
  return [
    {
      id: 'rekaai/reka-flash-3:free',
      name: 'Reka Flash 3',
      description: 'Default model that balances performance and credit usage.',
      creditUsage: 1,
      isDefault: true
    },
    {
      id: 'thudm/glm-z1-32b:free',
      name: 'Google LearnLM 1.5 Pro',
      description: 'More powerful learning model with improved understanding of complex topics.',
      creditUsage: 3,
      isDefault: false
    },
    {
      id: 'shisa-ai/shisa-v2-llama3.3-70b:free',
      name: 'NVIDIA Nemotron 253B',
      description: 'Advanced model with deep knowledge capabilities for complex subject matter.',
      creditUsage: 5,
      isDefault: false
    }
  ];
};

export const sendChatMessage = async (userId, message, model = 'reka-flash-3') => {
  try {
    // Check credit usage
    const { data: userCredits } = await supabase
      .from('credits')
      .select('id, amount, is_unlimited, expiry_date')
      .eq('user_id', userId)
      .gt('expiry_date', new Date().toISOString())
      .order('expiry_date', { ascending: true });
    
    const requiredCredits = MODEL_CREDIT_USAGE[model] || 1;
    
    // Verify user has enough credits
    const hasEnoughCredits = verifyCredits(userCredits, requiredCredits);
    
    if (!hasEnoughCredits) {
      throw new Error('Not enough credits available');
    }
    
    // Send request to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    
    // Record credit usage
    await recordCreditUsage(userId, requiredCredits, 'chatbot', model);
    
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Helper functions for credit management
async function verifyCredits(userCredits, requiredCredits) {
  // Implementation to check if user has enough credits
  // This would handle unlimited credits or sum up regular credits
}

async function recordCreditUsage(userId, amount, feature, model = null) {
  // Implementation to record credit usage and update credit balance
}