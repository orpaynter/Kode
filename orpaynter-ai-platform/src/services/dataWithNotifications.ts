import { supabaseDataService } from './supabaseData'
import { notificationService } from './notificationService'
import type { AssessmentStatus, ProjectStatus } from '../types'

/**
 * Enhanced data service that automatically creates notifications
 * for important data operations
 */
export class DataWithNotificationsService {
  /**
   * Update assessment status and create notification
   */
  async updateAssessmentStatus(
    id: string, 
    status: AssessmentStatus, 
    results?: any
  ) {
    // Update the assessment
    const assessment = await supabaseDataService.updateAssessmentStatus(id, status, results)
    
    // Create notification for status change
    try {
      await notificationService.notifyAssessmentStatusChange(
        assessment.user_id,
        assessment.id,
        status,
        assessment.property_address
      )
    } catch (notificationError) {
      console.error('Failed to create assessment notification:', notificationError)
      // Don't throw error for notification failure
    }

    return assessment
  }

  /**
   * Update project status and create notification
   */
  async updateProjectStatus(
    id: string, 
    status: ProjectStatus
  ) {
    // Update the project
    const project = await supabaseDataService.updateProjectStatus(id, status)
    
    // Create notification for status change
    try {
      await notificationService.notifyProjectStatusChange(
        project.user_id,
        project.id,
        status,
        project.title
      )
    } catch (notificationError) {
      console.error('Failed to create project notification:', notificationError)
      // Don't throw error for notification failure
    }

    return project
  }

  /**
   * Create project and notify contractor if assigned
   */
  async createProject(projectData: any) {
    const project = await supabaseDataService.createProject(projectData)
    
    // If contractor is assigned, notify them
    if (project.contractor_id) {
      try {
        await notificationService.notifyNewProjectAssignment(
          project.contractor_id,
          project.id,
          project.title,
          'Homeowner' // You might want to get actual homeowner name
        )
      } catch (notificationError) {
        console.error('Failed to create project assignment notification:', notificationError)
      }
    }

    return project
  }

  /**
   * Send welcome notification to new user
   */
  async sendWelcomeNotification(
    userId: string,
    userName: string,
    userRole: string
  ) {
    try {
      await notificationService.notifyWelcomeMessage(userId, userName, userRole)
    } catch (error) {
      console.error('Failed to send welcome notification:', error)
    }
  }

  /**
   * Notify payment received
   */
  async notifyPaymentReceived(
    userId: string,
    amount: number,
    projectTitle: string,
    projectId?: string
  ) {
    try {
      await notificationService.notifyPaymentReceived(
        userId,
        amount,
        projectTitle,
        projectId
      )
    } catch (error) {
      console.error('Failed to send payment notification:', error)
    }
  }

  // Delegate all other methods to the base service
  createAssessment = supabaseDataService.createAssessment.bind(supabaseDataService)
  getUserAssessments = supabaseDataService.getUserAssessments.bind(supabaseDataService)
  getAssessmentById = supabaseDataService.getAssessmentById.bind(supabaseDataService)
  getUserProjects = supabaseDataService.getUserProjects.bind(supabaseDataService)
  getProjectById = supabaseDataService.getProjectById.bind(supabaseDataService)
  getUserStats = supabaseDataService.getUserStats.bind(supabaseDataService)
  uploadAssessmentImage = supabaseDataService.uploadAssessmentImage.bind(supabaseDataService)
  subscribeToUserAssessments = supabaseDataService.subscribeToUserAssessments.bind(supabaseDataService)
  subscribeToUserProjects = supabaseDataService.subscribeToUserProjects.bind(supabaseDataService)
  subscribeToUserNotifications = supabaseDataService.subscribeToUserNotifications.bind(supabaseDataService)
  getUserNotifications = supabaseDataService.getUserNotifications.bind(supabaseDataService)
  markNotificationAsRead = supabaseDataService.markNotificationAsRead.bind(supabaseDataService)
  markAllNotificationsAsRead = supabaseDataService.markAllNotificationsAsRead.bind(supabaseDataService)
  deleteNotification = supabaseDataService.deleteNotification.bind(supabaseDataService)
  createNotification = supabaseDataService.createNotification.bind(supabaseDataService)
  
  // File storage methods
  uploadProjectRoofPhoto = supabaseDataService.uploadProjectRoofPhoto.bind(supabaseDataService)
  uploadMultipleRoofPhotos = supabaseDataService.uploadMultipleRoofPhotos.bind(supabaseDataService)
  getProjectPhotos = supabaseDataService.getProjectPhotos.bind(supabaseDataService)
  deleteProjectPhoto = supabaseDataService.deleteProjectPhoto.bind(supabaseDataService)
  uploadProjectDocument = supabaseDataService.uploadProjectDocument.bind(supabaseDataService)
}

export const dataWithNotificationsService = new DataWithNotificationsService()