import { useState, useEffect } from 'react';
import { ProjectsService } from '../services/projectsService';
import { AssessmentsService } from '../services/assessmentsService';
import { useAuth } from './useAuth';
import type { Database } from '../lib/supabase';

type Project = Database['public']['Tables']['projects']['Row'];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ProjectsService.getProjects(user.id);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newProject = await ProjectsService.createProject({
        ...projectData,
        user_id: user.id
      });
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await ProjectsService.updateProject(id, updates);
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? updatedProject : project
        )
      );
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await ProjectsService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  const getProjectsByStatus = async (status: string) => {
    if (!user) return [];
    
    try {
      return await ProjectsService.getProjectsByStatus(status, user.id);
    } catch (err) {
      console.error('Error fetching projects by status:', err);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByStatus
  };
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await ProjectsService.getProject(id);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return {
    project,
    loading,
    error
  };
}

export function useUserStats() {
  const [stats, setStats] = useState<{
    totalAssessments: number;
    activeProjects: number;
    completedProjects: number;
    totalSavings: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setStats({
          totalAssessments: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalSavings: 0
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch both project and assessment stats
        const [projectStats, assessmentStats] = await Promise.all([
          ProjectsService.getProjectStats(user.id),
          AssessmentsService.getAssessmentStats(user.id)
        ]);

        // Calculate total savings (difference between estimated and actual costs)
        const totalSavings = Math.max(0, projectStats.totalEstimated - projectStats.totalActual);

        setStats({
          totalAssessments: assessmentStats.total,
          activeProjects: projectStats.active,
          completedProjects: projectStats.completed,
          totalSavings
        });
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        setStats({
          totalAssessments: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalSavings: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    error
  };
}