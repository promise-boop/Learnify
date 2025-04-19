import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #5e72e4;
  margin-bottom: 30px;
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#5e72e4' : 'transparent'};
  color: ${props => props.active ? '#5e72e4' : '#8898aa'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.2s ease;
  
  &:hover {
    color: #5e72e4;
  }
`;

const ErrorMessage = styled.div`
  color: #f5365c;
  background-color: rgba(245, 54, 92, 0.1);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const Auth = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.signup ? 'signup' : 'login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email, password, userData) => {
    setError('');
    setLoading(true);
    
    try {
      await signup(email, password, userData);
      // After signup, redirect to the survey page
      navigate('/survey');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Logo>Learnify</Logo>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'login'} 
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </Tab>
          <Tab 
            active={activeTab === 'signup'} 
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </Tab>
        </TabContainer>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {activeTab === 'login' ? (
          <LoginForm onSubmit={handleLogin} isLoading={loading} />
        ) : (
          <SignupForm onSubmit={handleSignup} isLoading={loading} />
        )}
      </AuthCard>
    </AuthContainer>
  );
};

export default Auth;