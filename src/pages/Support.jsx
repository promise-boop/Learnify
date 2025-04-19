import React, { useState } from "react";
import styled from "styled-components";
import { HelpCircle, MessageCircle, Phone, Mail, FileText, ChevronDown, ChevronUp } from "lucide-react";

const SupportPage = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const SupportHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const SupportCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }
  
  h3 {
    margin-bottom: 0.5rem;
  }
`;

const ContactForm = styled.form`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight}30;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  min-height: 150px;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight}30;
  }
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FAQSection = styled.div`
  margin-top: 3rem;
`;

const FAQItem = styled.div`
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  text-align: left;
  padding: 1rem 1.5rem;
  background: ${({ theme, isOpen }) => isOpen ? theme.colors.primaryLight + '20' : theme.colors.cardBackground};
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }
`;

const FAQAnswer = styled.div`
  padding: ${({ isOpen }) => isOpen ? '1rem 1.5rem' : '0 1.5rem'};
  max-height: ${({ isOpen }) => isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
`;

const Support = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleQuestionClick = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally process the form submission
    alert('Your support request has been submitted. We will get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      question: "How do I purchase credits?",
      answer: "You can purchase credits from the Credits tab in your dashboard. We offer various packages: 50 credits for $5.99, 200 credits for $15.99, and 500 credits for $39.99. We also offer an unlimited monthly subscription for $25.99 that gives you unlimited access to all features for 30 days."
    },
    {
      question: "How long are my credits valid for?",
      answer: "All credits expire 30 days after purchase. This applies to all credit packages. For unlimited subscriptions, access ends after the 30-day period unless renewed."
    },
    {
      question: "How do I add or remove subjects?",
      answer: "You can add or remove subjects from the My Subjects tab. Simply click on the subject you wish to add, or click the remove button on subjects you no longer want to study."
    },
    {
      question: "Can I change my education level?",
      answer: "Yes, you can switch between IGCSE, AS Level, and A Level from the switcher at the top of the My Subjects tab. Note that changing levels will reset your subject selection for that level."
    },
    {
      question: "How do I create my own notes?",
      answer: "In the My Subjects tab, you'll find a section for creating and managing your notes. Click on 'Create Note', give it a name, and you'll be taken to the note editor where you can write and format your notes."
    },
    {
      question: "What is the Ramsey chatbot and how do I use it?",
      answer: "Ramsey is our AI-powered study assistant that can help answer questions, generate study materials, and create quizzes. You can access Ramsey from the sidebar and choose between different AI models based on your needs and credit balance."
    }
  ];

  return (
    <SupportPage>
      <SupportHeader>
        <h1>Need Help?</h1>
        <p>Find answers to common questions or get in touch with our support team</p>
      </SupportHeader>

      <SupportGrid>
        <SupportCard>
          <HelpCircle size={40} />
          <h3>Help Center</h3>
          <p>Browse our knowledge base for answers to common questions.</p>
        </SupportCard>
        
        <SupportCard>
          <MessageCircle size={40} />
          <h3>Chat Support</h3>
          <p>Chat with our support team during business hours (9AM-5PM GMT).</p>
        </SupportCard>
        
        <SupportCard>
          <Phone size={40} />
          <h3>Phone Support</h3>
          <p>Call us for urgent matters: +1 (555) 123-4567</p>
        </SupportCard>
      </SupportGrid>

      <ContactForm onSubmit={handleSubmit}>
        <h2>Contact Us</h2>
        <p className="mb-4">Fill out the form below and we'll get back to you as soon as possible.</p>
        
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="subject">Subject</Label>
          <Input 
            type="text" 
            id="subject" 
            name="subject" 
            value={formData.subject}
            onChange={handleInputChange}
            required 
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <TextArea 
            id="message" 
            name="message" 
            value={formData.message}
            onChange={handleInputChange}
            required 
          />
        </FormGroup>
        
        <SubmitButton type="submit">Submit Request</SubmitButton>
      </ContactForm>

      <FAQSection>
        <h2 className="mb-4">Frequently Asked Questions</h2>
        
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <FAQQuestion 
              isOpen={activeQuestion === index}
              onClick={() => handleQuestionClick(index)}
            >
              {faq.question}
              {activeQuestion === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </FAQQuestion>
            <FAQAnswer isOpen={activeQuestion === index}>
              <p>{faq.answer}</p>
            </FAQAnswer>
          </FAQItem>
        ))}
      </FAQSection>
    </SupportPage>
  );
};

export default Support;