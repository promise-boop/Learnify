import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../api/supabase';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #32325d;
  margin: 0;
`;

const LevelSwitcher = styled.div`
  display: flex;
  background-color: #edf2f7;
  border-radius: 8px;
  overflow: hidden;
`;

const LevelButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${props => props.active ? '#5e72e4' : 'transparent'};
  color: ${props => props.active ? 'white' : '#525f7f'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#5e72e4' : '#e2e8f0'};
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #32325d;
  margin: 20px 0 10px;
`;

const SubjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SubjectCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const SubjectName = styled.h3`
  font-size: 18px;
  color: #32325d;
  margin: 0 0 10px;
`;

const TopicsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const TopicItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #edf2f7;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  flex: 1;
  background-color: ${props => props.primary ? '#5e72e4' : 'white'};
  color: ${props => props.primary ? 'white' : '#5e72e4'};
  border: 1px solid ${props => props.primary ? 'transparent' : '#5e72e4'};
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#4c5ce1' : '#edf2f7'};
  }
`;

const NotesSection = styled.div`
  margin-top: 40px;
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const NoteCard = styled.div`
  background-color: #fff9db;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const NoteTitle = styled.h3`
  font-size: 18px;
  color: #32325d;
  margin: 0 0 10px;
`;

const NoteDate = styled.div`
  font-size: 12px;
  color: #8898aa;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  height: 100%;
  min-height: 150px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const MySubjects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeLevel, setActiveLevel] = useState(null);
  const [levels, setLevels] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch study levels
        const { data: levelsData } = await supabase
          .from('study_levels')
          .select('*');
        
        setLevels(levelsData || []);
        
        // Get user's selected level and subjects
        const { data: profileData } = await supabase
          .from('user_subjects')
          .select(`
            level_id,
            subject_id,
            subjects (
              id,
              name,
              topics (
                id,
                name
              )
            )
          `)
          .eq('user_id', user.id);
        
        // Get user's personal notes
        const { data: notesData } = await supabase
          .from('user_notes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        setUserNotes(notesData || []);
        
        // Process subjects data
        if (profileData && profileData.length > 0) {
          const initialLevelId = profileData[0].level_id;
          setActiveLevel(initialLevelId);
          
          // Group subjects by level
          const subjectsByLevel = {};
          profileData.forEach(item => {
            const levelId = item.level_id;
            if (!subjectsByLevel[levelId]) {
              subjectsByLevel[levelId] = [];
            }
            subjectsByLevel[levelId].push(item.subjects);
          });
          
          setSelectedSubjects(subjectsByLevel);
          
          // Fetch all available subjects for the current level
          const { data: allSubjects } = await supabase
            .from('subjects')
            .select('*')
            .eq('level_id', initialLevelId);
          
          setAvailableSubjects(allSubjects || []);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLevelChange = async (levelId) => {
    setActiveLevel(levelId);
    
    try {
      // Fetch all available subjects for the selected level
      const { data: allSubjects } = await supabase
        .from('subjects')
        .select('*')
        .eq('level_id', levelId);
      
      setAvailableSubjects(allSubjects || []);
    } catch (error) {
      console.error('Error fetching subjects for level:', error);
    }
  };

  const handleStartLearning = (subjectId) => {
    navigate(`/study/${subjectId}`);
  };

  const handleAddSubject = async (subjectId) => {
    try {
      await supabase.from('user_subjects').insert({
        user_id: user.id,
        subject_id: subjectId,
        level_id: activeLevel
      });
      
      // Refresh subjects list
      const { data } = await supabase
        .from('user_subjects')
        .select(`
          level_id,
          subject_id,
          subjects (
            id,
            name,
            topics (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('level_id', activeLevel);
      
      // Update selected subjects
      const updatedSubjects = { ...selectedSubjects };
      updatedSubjects[activeLevel] = data.map(item => item.subjects);
      setSelectedSubjects(updatedSubjects);
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleRemoveSubject = async (subjectId) => {
    try {
      await supabase
        .from('user_subjects')
        .delete()
        .eq('user_id', user.id)
        .eq('subject_id', subjectId);
      
      // Update local state
      const updatedSubjects = { ...selectedSubjects };
      updatedSubjects[activeLevel] = updatedSubjects[activeLevel].filter(
        subject => subject.id !== subjectId
      );
      setSelectedSubjects(updatedSubjects);
    } catch (error) {
      console.error('Error removing subject:', error);
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  if (loading) {
    return <div>Loading subjects...</div>;
  }

  return (
    <PageContainer>
      <Header>
        <Title>My Subjects</Title>
        <LevelSwitcher>
          {levels.map(level => (
            <LevelButton
              key={level.id}
              active={activeLevel === level.id}
              onClick={() => handleLevelChange(level.id)}
            >
              {level.name}
            </LevelButton>
          ))}
        </LevelSwitcher>
      </Header>
      
      <SectionTitle>My Selected Subjects</SectionTitle>
      <SubjectsGrid>
        {selectedSubjects[activeLevel]?.map(subject => (
          <SubjectCard key={subject.id}>
            <SubjectName>{subject.name}</SubjectName>
            <TopicsList>
              {subject.topics?.slice(0, 3).map(topic => (
                <TopicItem key={topic.id}>{topic.name}</TopicItem>
              ))}
              {subject.topics?.length > 3 && (
                <TopicItem>+ {subject.topics.length - 3} more topics</TopicItem>
              )}
            </TopicsList>
            <ButtonGroup>
              <Button 
                primary 
                onClick={() => handleStartLearning(subject.id)}
              >
                Start Learning
              </Button>
              <Button 
                onClick={() => handleRemoveSubject(subject.id)}
              >
                Remove
              </Button>
            </ButtonGroup>
          </SubjectCard>
        ))}
      </SubjectsGrid>
      
      <SectionTitle>Available Subjects</SectionTitle>
      <SubjectsGrid>
        {availableSubjects
          .filter(subject => 
            !selectedSubjects[activeLevel]?.some(s => s.id === subject.id)
          )
          .map(subject => (
            <SubjectCard key={subject.id}>
              <SubjectName>{subject.name}</SubjectName>
              <ButtonGroup>
                <Button 
                  primary 
                  onClick={() => handleAddSubject(subject.id)}
                >
                  Add Subject
                </Button>
              </ButtonGroup>
            </SubjectCard>
          ))}
      </SubjectsGrid>
      
      <NotesSection>
        <SectionTitle>My Notes</SectionTitle>
        <NotesGrid>
          {userNotes.map(note => (
            <NoteCard 
              key={note.id}
              onClick={() => handleEditNote(note.id)}
            >
              <NoteTitle>{note.title}</NoteTitle>
              <NoteDate>
                Last updated: {new Date(note.updated_at).toLocaleDateString()}
              </NoteDate>
              <div>
                {note.content?.substring(0, 100)}
                {note.content?.length > 100 && '...'}
              </div>
            </NoteCard>
          ))}
          <NoteCard>
            <AddButton onClick={handleCreateNote}>
              + Create New Note
            </AddButton>
          </NoteCard>
        </NotesGrid>
      </NotesSection>
    </PageContainer>
  );
};

export default MySubjects;