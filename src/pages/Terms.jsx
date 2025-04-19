import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsPage = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Terms = () => {
  return (
    <TermsPage>
      <Header>
        <BackButton to="/">
          <ArrowLeft size={16} />
          Back to Home
        </BackButton>
        <h1>Terms and Conditions</h1>
        <p>Last updated: April 19, 2025</p>
      </Header>

      <Section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Learnify. By using our website and services, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully before using Learnify.
        </p>
      </Section>

      <Section>
        <h2>2. Acceptance of Terms</h2>
        <p>
          By accessing or using Learnify, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing Learnify.
        </p>
      </Section>

      <Section>
        <h2>3. User Accounts</h2>
        <p>
          To access certain features of Learnify, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information when creating your account</li>
          <li>Maintain and promptly update your account information</li>
          <li>Protect your account password and restrict access to your account</li>
          <li>Notify Learnify immediately of any unauthorized use of your account</li>
        </ul>
      </Section>
      
      <Section>
        <h2>4. Credits System</h2>
        <p>
          Learnify operates on a credits-based system for accessing premium features and services:
        </p>
        <ul>
          <li>Credits are valid for 30 days from the date of purchase</li>
          <li>Credits can be used for generating notes, quizzes, and using the Ramsey chatbot</li>
          <li>Unused credits expire after the 30-day period and are non-refundable</li>
          <li>Unlimited credits subscription grants access to all premium features for a 30-day period</li>
        </ul>
      </Section>

      <Section>
        <h2>5. Intellectual Property</h2>
        <p>
          The content on Learnify, including text, graphics, logos, and educational materials, is the property of Learnify or its content suppliers and is protected by copyright laws. Users may not:
        </p>
        <ul>
          <li>Copy, reproduce, distribute, or create derivative works from our content</li>
          <li>Use our content for commercial purposes without express permission</li>
          <li>Remove any copyright or proprietary notices from materials</li>
        </ul>
      </Section>

      <Section>
        <h2>6. User Content</h2>
        <p>
          By submitting content to Learnify, including notes, comments, or other materials, you grant Learnify a non-exclusive, royalty-free license to use, modify, reproduce, and distribute your content for purposes of providing and improving our services.
        </p>
      </Section>

      <Section>
        <h2>7. Prohibited Activities</h2>
        <p>
          When using Learnify, you agree not to:
        </p>
        <ul>
          <li>Use the service for any illegal purpose</li>
          <li>Upload or transmit viruses or malicious code</li>
          <li>Attempt to gain unauthorized access to other user accounts or systems</li>
          <li>Use the service to cheat on academic assessments or exams</li>
          <li>Share your account credentials with others</li>
          <li>Engage in any activity that disrupts or interferes with the service</li>
        </ul>
      </Section>

      <Section>
        <h2>8. Termination</h2>
        <p>
          Learnify reserves the right to terminate or suspend your account and access to services at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, Learnify, or third parties, or for any other reason.
        </p>
      </Section>

      <Section>
        <h2>9. Disclaimer of Warranties</h2>
        <p>
          Learnify provides educational content and services "as is" without warranties of any kind, either express or implied. While we strive for accuracy, we do not guarantee that our content is error-free or up-to-date with current curricula.
        </p>
      </Section>

      <Section>
        <h2>10. Limitation of Liability</h2>
        <p>
          Learnify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
        </p>
      </Section>

      <Section>
        <h2>11. Changes to Terms</h2>
        <p>
          Learnify reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of Learnify after any changes indicates your acceptance of the new terms.
        </p>
      </Section>

      <Section>
        <h2>12. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at support@learnify.com.
        </p>
      </Section>
    </TermsPage>
  );
};

export default Terms;