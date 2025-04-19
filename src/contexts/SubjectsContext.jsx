import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../hooks/useAuth';

export const SubjectsContext = createContext(null);

export const SubjectsProvider = ({ children }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setSubjects(data || []);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user]);

  const addSubject = async (subjectData) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({ ...subjectData, user_id: user.id })
        .select();

      if (error) throw error;
      setSubjects([...subjects, data[0]]);
      return data[0];
    } catch (err) {
      console.error('Error adding subject:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateSubject = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      setSubjects(subjects.map(subject => 
        subject.id === id ? data[0] : subject
      ));
      return data[0];
    } catch (err) {
      console.error('Error updating subject:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteSubject = async (id) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setSubjects(subjects.filter(subject => subject.id !== id));
    } catch (err) {
      console.error('Error deleting subject:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    subjects,
    loading,
    error,
    addSubject,
    updateSubject,
    deleteSubject
  };

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
};

export default SubjectsProvider;