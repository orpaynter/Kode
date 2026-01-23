import { useState, useEffect } from 'react';
import { AssessmentsService } from '../services/assessmentsService';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Assessment = Database['public']['Tables']['assessments']['Row'];

export function useAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAssessments = async () => {
    if (!user) {
      setAssessments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await AssessmentsService.getAssessments(user.id);
      setAssessments(data);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assessments');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [user]);

  const createAssessment = async (assessmentData: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newAssessment = await AssessmentsService.createAssessment({
        ...assessmentData,
        user_id: user.id
      });
      setAssessments(prev => [newAssessment, ...prev]);
      return newAssessment;
    } catch (err) {
      console.error('Error creating assessment:', err);
      throw err;
    }
  };

  const updateAssessment = async (id: string, updates: Partial<Assessment>) => {
    try {
      const updatedAssessment = await AssessmentsService.updateAssessment(id, updates);
      setAssessments(prev => 
        prev.map(assessment => 
          assessment.id === id ? updatedAssessment : assessment
        )
      );
      return updatedAssessment;
    } catch (err) {
      console.error('Error updating assessment:', err);
      throw err;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      await AssessmentsService.deleteAssessment(id);
      setAssessments(prev => prev.filter(assessment => assessment.id !== id));
    } catch (err) {
      console.error('Error deleting assessment:', err);
      throw err;
    }
  };

  const getAssessmentsByStatus = async (status: string) => {
    if (!user) return [];
    
    try {
      return await AssessmentsService.getAssessmentsByStatus(status, user.id);
    } catch (err) {
      console.error('Error fetching assessments by status:', err);
      throw err;
    }
  };

  const getAssessmentStats = async () => {
    if (!user) return null;
    
    try {
      return await AssessmentsService.getAssessmentStats(user.id);
    } catch (err) {
      console.error('Error fetching assessment stats:', err);
      throw err;
    }
  };

  return {
    assessments,
    loading,
    error,
    refetch: fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    getAssessmentsByStatus,
    getAssessmentStats
  };
}

export function useAssessment(id: string) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await AssessmentsService.getAssessment(id);
        setAssessment(data);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch assessment');
        setAssessment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  return {
    assessment,
    loading,
    error
  };
}