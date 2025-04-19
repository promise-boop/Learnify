import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const LandingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  max-width: 800px;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const HeroImage = styled.img`
  max-width: 80%;
  height: auto;
  margin-top: 3rem;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background-color: white;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #32325d;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #5e72e4;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #32325d;
`;

const FeatureDescription = styled.p`
  color: #525f7f;
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  padding: 5rem 2rem;
  background-color: #f8f9fa;
`;

const StepsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const StepNumber = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #5e72e4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #32325d;
`;

const StepDescription = styled.p`
  color: #525f7f;
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
  color: white;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
`;

const CTAText = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const Footer = styled.footer`
  padding: 3rem 2rem;
  background-color: #32325d;
  color: white;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
`;

const FooterLogo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FooterLinkGroup = styled.div``;

const FooterLinkTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: white;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <LandingContainer>
      <Hero>
        <HeroTitle>Learn Smarter with AI-Powered Study Tools</HeroTitle>
        <HeroSubtitle>
          Learnify uses advanced AI to help you master any subject. Create custom study plans, 
          get personalized explanations, and track your progress.
        </HeroSubtitle>
        <ButtonGroup>
          <Button size="large" onClick={() => navigate('/auth')}>Get Started for Free</Button>
          <Button size="large" variant="secondary" onClick={() => navigate('/demo')}>See Demo</Button>
        </ButtonGroup>
        <HeroImage src="/api/placeholder/800/500" alt="Learnify Dashboard Preview" />
      </Hero>
      
      <FeaturesSection>
        <SectionTitle>Why Choose Learnify?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI-Powered Learning</FeatureTitle>
            <FeatureDescription>
              Our advanced AI understands your learning style and creates personalized study materials 
              just for you.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📚</FeatureIcon>
            <FeatureTitle>Any Subject, Any Level</FeatureTitle>
            <FeatureDescription>
              From math and science to history and literature, Learnify helps you master any subject at 
              any difficulty level.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Track Your Progress</FeatureTitle>
            <FeatureDescription>
              Visual analytics show your improvement over time, helping you focus on areas that need 
              more attention.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💬</FeatureIcon>
            <FeatureTitle>Ask Anything</FeatureTitle>
            <FeatureDescription>
              Our AI tutor is available 24/7 to answer questions, provide explanations, and help you 
              overcome learning obstacles.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Efficient Learning</FeatureTitle>
            <FeatureDescription>
              Learn more in less time with scientifically-backed study techniques and AI-optimized 
              content delivery.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Private & Secure</FeatureTitle>
            <FeatureDescription>
              Your learning data is encrypted and never shared. We take your privacy and security 
              seriously.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsContainer>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>Create Your Learning Profile</StepTitle>
              <StepDescription>
                Tell us what subjects you're studying, your goals, and your current knowledge level. 
                Our AI will create a personalized learning profile for you.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>Add Your Study Materials</StepTitle>
              <StepDescription>
                Upload your notes, textbooks, or just tell us what you're learning. Learnify will organize 
                everything and generate study materials tailored to your needs.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>Learn with AI Assistance</StepTitle>
              <StepDescription>
                Study with interactive flashcards, quizzes, and summaries. Ask questions anytime and get 
                instant, personalized explanations from our AI tutor.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>4</StepNumber>
            <StepContent>
              <StepTitle>Track Your Progress</StepTitle>
              <StepDescription>
                Watch your knowledge grow with detailed analytics. Identify areas that need more work and 
                celebrate your achievements as you master each topic.
              </StepDescription>
            </StepContent>
          </Step>
        </StepsContainer>
      </HowItWorksSection>
      
      <CTASection>
        <CTATitle>Start Learning Smarter Today</CTATitle>
        <CTAText>
          Join thousands of students who are accelerating their learning and achieving better results 
          with Learnify.
        </CTAText>
        <Button size="large" onClick={() => navigate('/auth')}>Sign Up for Free</Button>
      </CTASection>
      
      <Footer>
        <FooterContent>
          <div>
            <FooterLogo>Learnify</FooterLogo>
            <p>AI-powered learning for everyone.</p>
          </div>
          
          <FooterLinks>
            <FooterLinkGroup>
              <FooterLinkTitle>Product</FooterLinkTitle>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/demo">Demo</FooterLink>
            </FooterLinkGroup>
            
            <FooterLinkGroup>
              <FooterLinkTitle>Resources</FooterLinkTitle>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/tutorials">Tutorials</FooterLink>
              <FooterLink to="/help">Help Center</FooterLink>