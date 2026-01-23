import { supabase } from '../lib/supabase'
import type { 
  Assessment, 
  Project, 
  User,
  AssessmentStatus,
  ProjectStatus 
} from '../types'

export class SupabaseDataService {
  // Assessment operations
  async createAssessment(assessmentData: {
    property_address: string
    assessment_type: 'roof' | 'siding' | 'windows' | 'general'
    description?: string
    images?: string[]
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        property_address: assessmentData.property_address,
        assessment_type: assessmentData.assessment_type,
        description: assessmentData.description,
        images: assessmentData.images || [],
        status: 'pending' as AssessmentStatus,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserAssessments(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id
    if (!targetUserId) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getAssessmentById(id: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async updateAssessmentStatus(id: string, status: AssessmentStatus, results?: any) {
    const { data, error } = await supabase
      .from('assessments')
      .update({ 
        status, 
        results,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Project operations
  async createProject(projectData: {
    title: string
    description: string
    type: string
    priority: 'low' | 'medium' | 'high'
    assessment_id?: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title: projectData.title,
        description: projectData.description,
        type: projectData.type,
        priority: projectData.priority,
        assessment_id: projectData.assessment_id,
        status: 'planning' as ProjectStatus,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserProjects(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id
    if (!targetUserId) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        assessments(*)
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getProjectById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        assessments(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async updateProjectStatus(id: string, status: ProjectStatus) {
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // User statistics
  async getUserStats(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id
    if (!targetUserId) throw new Error('User not authenticated')

    // Get assessment count
    const { count: assessmentCount } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)

    // Get project count
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)

    // Get active projects count
    const { count: activeProjectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', targetUserId)
      .in('status', ['planning', 'in_progress'])

    return {
      totalAssessments: assessmentCount || 0,
      totalProjects: projectCount || 0,
      activeProjects: activeProjectCount || 0
    }
  }

  // File upload for assessment images
  async uploadAssessmentImage(file: File, assessmentId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${assessmentId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('assessment-images')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('assessment-images')
      .getPublicUrl(fileName)

    return publicUrl
  }

  // File upload for project roof photos
  async uploadProjectRoofPhoto(file: File, projectId: string, photoType: 'before' | 'during' | 'after' = 'before') {
    const fileExt = file.name.split('.').pop()
    const fileName = `projects/${projectId}/roof-photos/${photoType}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName)

    return { publicUrl, fileName }
  }

  // Upload multiple roof photos
  async uploadMultipleRoofPhotos(
    files: File[], 
    projectId: string, 
    photoType: 'before' | 'during' | 'after' = 'before'
  ) {
    const uploadPromises = files.map(file => 
      this.uploadProjectRoofPhoto(file, projectId, photoType)
    )
    
    const results = await Promise.all(uploadPromises)
    return results
  }

  // Get project photos
  async getProjectPhotos(projectId: string) {
    const { data, error } = await supabase.storage
      .from('project-images')
      .list(`projects/${projectId}/roof-photos`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    // Group photos by type
    const photosByType = {
      before: [] as string[],
      during: [] as string[],
      after: [] as string[]
    }

    data.forEach(file => {
      const photoType = file.name.includes('/before/') ? 'before' : 
                       file.name.includes('/during/') ? 'during' : 'after'
      
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(`projects/${projectId}/roof-photos/${file.name}`)
      
      photosByType[photoType].push(publicUrl)
    })

    return photosByType
  }

  // Delete project photo
  async deleteProjectPhoto(fileName: string) {
    const { error } = await supabase.storage
      .from('project-images')
      .remove([fileName])

    if (error) throw error
  }

  // Upload general project document
  async uploadProjectDocument(file: File, projectId: string, documentType: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `projects/${projectId}/documents/${documentType}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('project-documents')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('project-documents')
      .getPublicUrl(fileName)

    return { publicUrl, fileName, originalName: file.name }
  }

  // Notification operations
  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        read: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async markAllNotificationsAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        read: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false)
      .select()

    if (error) throw error
    return data
  }

  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error
  }

  async createNotification(notificationData: {
    user_id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    action_url?: string
    metadata?: any
  }) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notificationData,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Real-time subscriptions
  subscribeToUserAssessments(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-assessments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  subscribeToUserProjects(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  subscribeToUserNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}

export const supabaseDataService = new SupabaseDataService()