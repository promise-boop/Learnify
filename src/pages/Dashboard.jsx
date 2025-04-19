import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubjects } from '../hooks/useSubjects';
import { useCredits } from '../hooks/useCredits';
import { supabase } from '../api/supabase';

// Array of greeting messages for randomization
const GREETINGS = [
  "Welcome back to your studies",
  "Ready to learn something new today",
  "Great to see you again",
  "Let's continue your learning journey",
  "Hope you're ready to ace your studies",
  "Time for another productive study session"
];

// Quick action items
const QUICK_ACTIONS = [
  {
    title: "Generate Notes",
    description: "Create AI-powered study notes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    action: "/subjects",
    color: "bg-blue-500"
  },
  {
    title: "Continue Studying",
    description: "Pick up where you left off",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    action: "/subjects",
    color: "bg-green-500"
  },
  {
    title: "View Progress",
    description: "Track your learning journey",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    action: "/progress",
    color: "bg-purple-500"
  },
  {
    title: "Chat with Ramsey",
    description: "Get help from your AI assistant",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    action: "/chatbot",
    color: "bg-yellow-500"
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const { userSubjects, loadUserSubjects } = useSubjects();
  const { userCredits } = useCredits();
  const navigate = useNavigate();
  
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Set greeting and time of day
  useEffect(() => {
    if (user) {
      // Get random greeting
      const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setGreeting(randomGreeting);
      
      // Set time of day greeting
      const hour = new Date().getHours();
      let dayTime = 'morning';
      if (hour >= 12 && hour < 17) dayTime = 'afternoon';
      else if (hour >= 17) dayTime = 'evening';
      setTimeOfDay(dayTime);
      
      // Load user data
      loadUserData();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Load user data including subjects, recent activity, and progress
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Load subjects if not already loaded
      if (!userSubjects || userSubjects.length === 0) {
        await loadUserSubjects();
      }
      
      // Get recent activity (study sessions, note generations, quiz completions)
      const { data: activities } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (activities) {
        setRecentActivity(activities);
      }
      
      // Get subject progress data
      const { data: progress } = await supabase
        .from('subject_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_studied_at', { ascending: false });
      
      if (progress) {
        setSubjectProgress(progress);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format activity type for display
  const formatActivityType = (type) => {
    const types = {
      'note_generation': 'Generated Notes',
      'study_session': 'Study Session',
      'quiz_completion': 'Completed Quiz',
      'credit_purchase': 'Purchased Credits'
    };
    return types[type] || type;
  };

  // Toggle expanded state for a subject
  const toggleSubjectExpand = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'note_generation':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'study_session':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        );
      case 'quiz_completion':
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'credit_purchase':
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  // Format duration in minutes to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return '0 mins';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  // Navigate to a specific page
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 mb-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Good {timeOfDay}, {user?.user_metadata?.name || user?.email || 'Scholar'}!
            </h1>
            <p className="text-blue-100">{greeting}. What would you like to learn today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Credits Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-500 text-sm uppercase font-medium">Available Credits</h2>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-gray-800">{userCredits?.amount || 0}</span>
                  {userCredits?.is_unlimited && (
                    <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">
                      Unlimited
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate('/credits')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Get more credits
                </button>
              </div>
            </div>

            {/* Study Time Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-500 text-sm uppercase font-medium">Total Study Time</h2>
                <div className="text-3xl font-bold text-gray-800">
                  {formatDuration(subjectProgress.reduce((total, subject) => total + (subject.total_time_spent || 0), 0))}
                </div>
                <span className="text-sm text-gray-500">
                  Across {subjectProgress.length} {subjectProgress.length === 1 ? 'subject' : 'subjects'}
                </span>
              </div>
            </div>

            {/* Quiz Results Card */}
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-gray-500 text-sm uppercase font-medium">Quiz Success Rate</h2>
                <div className="text-3xl font-bold text-gray-800">
                  {subjectProgress.length > 0 
                    ? Math.round(
                        (subjectProgress.reduce((total, subject) => total + (subject.correct_answers || 0), 0) / 
                        subjectProgress.reduce((total, subject) => total + (subject.total_questions || 1), 0)) * 100
                      ) 
                    : 0}%
                </div>
                <span className="text-sm text-gray-500">
                  {subjectProgress.reduce((total, subject) => total + (subject.quizzes_taken || 0), 0)} quizzes taken
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {QUICK_ACTIONS.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(action.action)}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-200"
                    >
                      <div className={`p-2 rounded-full ${action.color} text-white mr-3`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects Studied */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Subjects Studied</h2>
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : userSubjects && userSubjects.filter(subject => {
                    // Only show subjects with study progress
                    return subjectProgress.some(p => p.subject_id === subject.id && p.total_time_spent > 0);
                  }).length > 0 ? (
                  <div className="space-y-4">
                    {userSubjects
                      .filter(subject => {
                        // Only show subjects with study progress
                        return subjectProgress.some(p => p.subject_id === subject.id && p.total_time_spent > 0);
                      })
                      .map((subject, index) => {
                        const progress = subjectProgress.find(p => p.subject_id === subject.id) || {};
                        const isExpanded = expandedSubjects[subject.id] || false;
                        
                        return (
                          <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div 
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleSubjectExpand(subject.id)}
                            >
                              <h3 className="font-medium text-gray-800">{subject.name}</h3>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            
                            {isExpanded && (
                              <div className="mt-3 pl-3 border-l-2 border-gray-100 space-y-2">
                                {progress.topics_studied && progress.topics_studied.length > 0 ? (
                                  <>
                                    <p className="text-sm text-gray-500 font-medium">Topics Studied:</p>
                                    <ul className="space-y-2">
                                      {progress.topics_studied.map((topic, idx) => (
                                        <li key={idx} className="text-sm flex justify-between">
                                          <span>{topic.name}</span>
                                          <span className="text-gray-400">
                                            {formatDate(topic.date)} • {formatDuration(topic.duration)}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-500 italic">No specific topics recorded</p>
                                )}
                                
                                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                                  <span>Total time: {formatDuration(progress.total_time_spent || 0)}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/subjects/${subject.id}`);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Continue
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No subjects studied yet.</p>
                    <button 
                      onClick={() => navigate('/subjects')}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      Start studying
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        {getActivityIcon(activity.activity_type)}
                        <div className="ml-3">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-800">
                              {formatActivityType(activity.activity_type)}
                            </h3>
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full">
                              {activity.subject_name || 'General'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {activity.description || `You ${activity.activity_type.replace('_', ' ')} for ${activity.subject_name || 'general study'}`}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(activity.created_at)}
                            {activity.duration && ` • ${formatDuration(activity.duration)}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No recent activity found. Let's start learning!</p>
                    <button 
                      onClick={() => navigate('/subjects')}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Explore Subjects
                    </button>
                  </div>
                )}
              </div>

              {/* Subject Progress */}
              {userSubjects && userSubjects.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">My Subjects</h2>
                    <button 
                      onClick={() => navigate('/subjects')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View all
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {userSubjects.slice(0, 3).map((subject, index) => {
                      const progress = subjectProgress.find(p => p.subject_id === subject.id) || {};
                      const completionPercentage = progress.completion_percentage || 0;
                      
                      return (
                        <div key={index} className="cursor-pointer" onClick={() => navigate(`/subjects/${subject.id}`)}>
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-medium text-gray-800">{subject.name}</h3>
                            <span className="text-sm text-gray-500">
                              {completionPercentage}% complete
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {progress.topics_studied?.length || 0} topics studied
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/subjects/${subject.id}`);
                              }}
                              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                            >
                              Start Learning
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;