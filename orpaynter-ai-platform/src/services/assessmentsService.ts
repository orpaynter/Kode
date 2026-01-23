import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Assessment = Database['public']['Tables']['assessments']['Row'];
type AssessmentInsert = Database['public']['Tables']['assessments']['Insert'];
type AssessmentUpdate = Database['public']['Tables']['assessments']['Update'];

export class AssessmentsService {
  // Get all assessments for a user
  static async getAssessments(userId?: string) {
    try {
      let query = supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching assessments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessments:', error);
      throw error;
    }
  }

  // Get a single assessment by ID
  static async getAssessment(id: string) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching assessment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessment:', error);
      throw error;
    }
  }

  // Create a new assessment
  static async createAssessment(assessment: AssessmentInsert) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert(assessment)
        .select()
        .single();

      if (error) {
        console.error('Error creating assessment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createAssessment:', error);
      throw error;
    }
  }

  // Update an assessment
  static async updateAssessment(id: string, updates: AssessmentUpdate) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating assessment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateAssessment:', error);
      throw error;
    }
  }

  // Delete an assessment
  static async deleteAssessment(id: string) {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting assessment:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteAssessment:', error);
      throw error;
    }
  }

  // Get assessments by status
  static async getAssessmentsByStatus(status: string, userId?: string) {
    try {
      let query = supabase
        .from('assessments')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching assessments by status:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsByStatus:', error);
      throw error;
    }
  }

  // Get recent assessments
  static async getRecentAssessments(limit: number = 10, userId?: string) {
    try {
      let query = supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recent assessments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentAssessments:', error);
      throw error;
    }
  }

  // Get assessment statistics
  static async getAssessmentStats(userId?: string) {
    try {
      let query = supabase
        .from('assessments')
        .select('status, damage_level, estimated_cost, ai_confidence');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching assessment stats:', error);
        throw error;
      }

      const stats = {
        total: data?.length || 0,
        completed: data?.filter(a => a.status === 'completed').length || 0,
        processing: data?.filter(a => a.status === 'processing').length || 0,
        pending: data?.filter(a => a.status === 'pending').length || 0,
        avgConfidence: data?.length ? 
          data.reduce((sum, a) => sum + (a.ai_confidence || 0), 0) / data.length : 0,
        totalEstimatedCost: data?.reduce((sum, a) => sum + (a.estimated_cost || 0), 0) || 0,
        damageBreakdown: {
          minor: data?.filter(a => a.damage_level === 'minor').length || 0,
          moderate: data?.filter(a => a.damage_level === 'moderate').length || 0,
          severe: data?.filter(a => a.damage_level === 'severe').length || 0
        }
      };

      return stats;
    } catch (error) {
      console.error('Error in getAssessmentStats:', error);
      throw error;
    }
  }

  // Search assessments
  static async searchAssessments(searchTerm: string, userId?: string) {
    try {
      let query = supabase
        .from('assessments')
        .select('*')
        .or(`property_address.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching assessments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchAssessments:', error);
      throw error;
    }
  }
}