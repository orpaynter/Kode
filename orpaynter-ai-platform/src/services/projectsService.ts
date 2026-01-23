import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export class ProjectsService {
  // Get all projects for a user
  static async getProjects(userId?: string) {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProjects:', error);
      throw error;
    }
  }

  // Get a single project by ID
  static async getProject(id: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getProject:', error);
      throw error;
    }
  }

  // Create a new project
  static async createProject(project: ProjectInsert) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw error;
    }
  }

  // Update a project
  static async updateProject(id: string, updates: ProjectUpdate) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProject:', error);
      throw error;
    }
  }

  // Delete a project
  static async deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      throw error;
    }
  }

  // Get projects by status
  static async getProjectsByStatus(status: string, userId?: string) {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching projects by status:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProjectsByStatus:', error);
      throw error;
    }
  }

  // Get project statistics
  static async getProjectStats(userId?: string) {
    try {
      let query = supabase
        .from('projects')
        .select('status, estimated_cost, actual_cost');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching project stats:', error);
        throw error;
      }

      const stats = {
        total: data?.length || 0,
        active: data?.filter(p => p.status === 'in_progress').length || 0,
        completed: data?.filter(p => p.status === 'completed').length || 0,
        pending: data?.filter(p => p.status === 'pending').length || 0,
        totalEstimated: data?.reduce((sum, p) => sum + (p.estimated_cost || 0), 0) || 0,
        totalActual: data?.reduce((sum, p) => sum + (p.actual_cost || 0), 0) || 0
      };

      return stats;
    } catch (error) {
      console.error('Error in getProjectStats:', error);
      throw error;
    }
  }
}