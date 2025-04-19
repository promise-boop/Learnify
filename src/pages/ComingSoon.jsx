import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const ComingSoonPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // List of upcoming features
  const upcomingFeatures = [
    {
      title: "Audio Recording and Upload",
      description: "Record your lectures or upload audio files to automatically generate notes and summaries.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      title: "YouTube Video Notes",
      description: "Paste a YouTube video link and get comprehensive notes and summaries automatically.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "PDF Upload and Analysis",
      description: "Upload PDF files to extract key information and generate study materials automatically.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Mobile App",
      description: "Take Learnify with you everywhere with our upcoming mobile application for iOS and Android.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Coming Soon</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <p className="text-gray-600 mb-4">
              We're constantly working to improve Learnify and add new features to enhance your learning experience.
              Here's a sneak peek at what we're building next:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {upcomingFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
                      {feature.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                      <p className="mt-1 text-gray-600">{feature.description}</p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-xl font-bold mb-3">Want to influence our roadmap?</h2>
            <p className="mb-4">
              We value your feedback! Let us know which features you'd like to see next and how we can make Learnify better for you.
            </p>
            <button 
              onClick={() => navigate('/support')}
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              Share Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;