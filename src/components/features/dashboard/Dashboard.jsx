import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../api/supabase';
import { formatDate, formatDuration } from '../../../utils/formatters';
import WelcomeMessage from './WelcomeMessage';
import CreditStatus from './CreditStatus';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import SubjectProgress from './SubjectProgress';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 20px;
  padding: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch user credits
        const { data: creditsData } = await supabase
          .from('credits')
          .select('amount, is_unlimited')
          .eq('user_id', user.id)
          .gt('expiry_date', new Date().toISOString());
        
        const totalCredits = creditsData.reduce((sum, credit) => {
          if (credit.is_unlimited) return Infinity;
          return sum + credit.amount;
        }, 0);
        setCredits(totalCredits);

        // Fetch recent activity
        const { data: activityData } = await supabase.rpc('get_recent_user_activity', {
          user_id_param: user.id,
          limit_param: 5
        });
        setRecentActivity(activityData || []);

        // Fetch subject progress
        const { data: progressData } = await supabase.rpc('get_user_subject_progress', {
          user_id_param: user.id
        });
        setSubjectProgress(progressData || []);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'generate-notes':
        navigate('/subjects');
        break;
      case 'continue-studying':
        navigate('/study');
        break;
      case 'view-progress':
        navigate('/progress');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <DashboardContainer>
      <WelcomeMessage userName={user?.profile?.full_name || 'Student'} />
      
      <CreditStatus credits={credits} />
      
      <RecentActivity activities={recentActivity} />
      
      <QuickActions onActionSelect={handleQuickAction} />
      
      <SubjectProgress 
        subjectProgress={subjectProgress} 
        onSubjectClick={(subjectId) => navigate(`/subjects/${subjectId}`)} 
      />
    </DashboardContainer>
  );
};

export default Dashboard;