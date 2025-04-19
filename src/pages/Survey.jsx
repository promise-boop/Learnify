import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../api/supabase';
import styled from 'styled-components';

const SurveyContainer = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #32325d;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #525f7f;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #32325d;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  input {
    margin-right: 8px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #5e72e4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #4c5ce1;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const Survey = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [studyLevel, setStudyLevel] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [country, setCountry] = useState('');
  const [heardFrom, setHeardFrom] = useState('');
  const [preferredModel, setPreferredModel] = useState('reka-flash-3');
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSubjects = async () => {
      try {
        // Fetch all subjects grouped by level
        const { data, error } = await supabase
          .from('subjects')
          .select(`
            id,
            name,
            level_id,
            study_levels (
              id,
              name
            )
          `);

        if (error) throw error;

        // Organize subjects by study level
        const subjectsByLevel = {};
        data.forEach(subject => {
          const levelId = subject.level_id;
          const levelName = subject.study_levels.name;
          
          if (!subjectsByLevel[levelId]) {
            subjectsByLevel[levelId] = {
              id: levelId,
              name: levelName,
              subjects: []
            };
          }
          
          subjectsByLevel[levelId].subjects.push({
            id: subject.id,
            name: subject.name
          });
        });
        
        setAvailableSubjects(Object.values(subjectsByLevel));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user, navigate]);

  const handleSubjectToggle = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!studyLevel) {
        throw new Error('Please select a study level');
      }
      
      if (selectedSubjects.length === 0) {
        throw new Error('Please select at least one subject');
      }
      
      // Update user profile
      await supabase
        .from('user_profiles')
        .update({
          country,
          heard_from: heardFrom,
          preferred_model: preferredModel
        })
        .eq('id', user.id);
      
      // Add selected subjects for the user
      const userSubjects = selectedSubjects.map(subjectId => ({
        user_id: user.id,
        subject_id: subjectId,
        level_id: parseInt(studyLevel)
      }));
      
      await supabase.from('user_subjects').insert(userSubjects);
      
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading survey...</div>;
  }

  return (
    <SurveyContainer>
      <Title>Welcome to Learnify!</Title>
      <Description>
        Please take a moment to complete this survey so we can personalize your learning experience.
      </Description>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Which level are you studying?</Label>
          <Select 
            value={studyLevel} 
            onChange={(e) => setStudyLevel(e.target.value)}
            required
          >
            <option value="">Select your study level</option>
            {availableSubjects.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </Select>
        </FormGroup>
        
        {studyLevel && (
          <FormGroup>
            <Label>Select the subjects you want to study:</Label>
            <CheckboxGroup>
              {availableSubjects
                .find(level => level.id.toString() === studyLevel)
                ?.subjects.map(subject => (
                  <CheckboxLabel key={subject.id}>
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => handleSubjectToggle(subject.id)}
                    />
                    {subject.name}
                  </CheckboxLabel>
                ))}
            </CheckboxGroup>
          </FormGroup>
        )}
        
        <FormGroup>
          <Label>Which country are you studying in?</Label>
          <Input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter your country"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>How did you hear about us?</Label>
          <Select
            value={heardFrom}
            onChange={(e) => setHeardFrom(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            <option value="social_media">Social Media</option>
            <option value="friend">Friend or Colleague</option>
            <option value="search">Search Engine</option>
            <option value="advertisement">Advertisement</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Which AI model do you prefer?</Label>
          <Select
            value={preferredModel}
            onChange={(e) => setPreferredModel(e.target.value)}
          >
            <option value="reka-flash-3">Reka Flash 3 (Default)</option>
            <option value="google/learnlm-1.5-pro:experimental">Google LearnLM 1.5 Pro</option>
            <option value="nvidia/nemotron-253b:free">NVIDIA Nemotron 253B</option>
          </Select>
        </FormGroup>
        
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Complete Survey'}
        </Button>
      </form>
    </SurveyContainer>
  );
};

export default Survey;