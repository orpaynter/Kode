import { supabase } from '../lib/supabase'
import type { NotificationType } from '../types'

export class NotificationService {
  // Create notification for assessment status change
  async notifyAssessmentStatusChange(
    userId: string,
    assessmentId: string,
    newStatus: string,
    propertyAddress: string
  ) {
    const statusMessages = {
      pending: 'Your assessment request has been received and is pending review.',
      in_progress: 'Your assessment is now in progress. Our team is analyzing your property.',
      completed: 'Your assessment has been completed! View the results now.',
      cancelled: 'Your assessment has been cancelled.'
    }

    const statusTypes = {
      pending: 'info' as const,
      in_progress: 'info' as const,
      completed: 'success' as const,
      cancelled: 'warning' as const
    }

    const message = statusMessages[newStatus as keyof typeof statusMessages] || 
      `Your assessment status has been updated to ${newStatus}.`
    
    const type = statusTypes[newStatus as keyof typeof statusTypes] || 'info'

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Assessment Update',
        message: `${message} Property: ${propertyAddress}`,
        type,
        action_url: `/assessments/${assessmentId}`,
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create notification for project status change
  async notifyProjectStatusChange(
    userId: string,
    projectId: string,
    newStatus: string,
    projectTitle: string
  ) {
    const statusMessages = {
      planning: 'Your project is in the planning phase.',
      in_progress: 'Your project has started! Work is now in progress.',
      on_hold: 'Your project has been put on hold.',
      completed: 'Congratulations! Your project has been completed.',
      cancelled: 'Your project has been cancelled.'
    }

    const statusTypes = {
      planning: 'info' as const,
      in_progress: 'info' as const,
      on_hold: 'warning' as const,
      completed: 'success' as const,
      cancelled: 'warning' as const
    }

    const message = statusMessages[newStatus as keyof typeof statusMessages] || 
      `Your project status has been updated to ${newStatus}.`
    
    const type = statusTypes[newStatus as keyof typeof statusTypes] || 'info'

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Project Update',
        message: `${message} Project: ${projectTitle}`,
        type,
        action_url: `/projects/${projectId}`,
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create notification for new project assignment (for contractors)
  async notifyNewProjectAssignment(
    contractorId: string,
    projectId: string,
    projectTitle: string,
    homeownerName: string
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: contractorId,
        title: 'New Project Assignment',
        message: `You have been assigned to a new project: ${projectTitle} by ${homeownerName}`,
        type: 'info',
        action_url: `/projects/${projectId}`,
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create notification for payment received
  async notifyPaymentReceived(
    userId: string,
    amount: number,
    projectTitle: string,
    projectId?: string
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Payment Received',
        message: `Payment of $${amount.toFixed(2)} has been received for ${projectTitle}`,
        type: 'success',
        action_url: projectId ? `/projects/${projectId}` : '/subscription',
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create notification for subscription expiry warning
  async notifySubscriptionExpiring(
    userId: string,
    daysUntilExpiry: number
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Subscription Expiring Soon',
        message: `Your subscription will expire in ${daysUntilExpiry} days. Renew now to continue using all features.`,
        type: 'warning',
        action_url: '/subscription',
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create notification for welcome message
  async notifyWelcomeMessage(
    userId: string,
    userName: string,
    userRole: string
  ) {
    const roleMessages = {
      homeowner: 'Welcome to OrPaynter! Start by requesting an assessment for your property.',
      contractor: 'Welcome to OrPaynter! You can now receive project assignments and manage your work.',
      insurance: 'Welcome to OrPaynter! Access assessment reports and project documentation.',
      supplier: 'Welcome to OrPaynter! Connect with contractors and manage your product catalog.'
    }

    const message = roleMessages[userRole as keyof typeof roleMessages] || 
      'Welcome to OrPaynter! Explore the platform to get started.'

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: `Welcome to OrPaynter, ${userName}!`,
        message,
        type: 'info',
        action_url: '/dashboard',
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create notification for system maintenance
  async notifySystemMaintenance(
    userId: string,
    maintenanceDate: string,
    duration: string
  ) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Scheduled Maintenance',
        message: `System maintenance is scheduled for ${maintenanceDate} and will last approximately ${duration}. Some features may be temporarily unavailable.`,
        type: 'warning',
        action_url: '/support',
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Bulk notification methods
  async notifyMultipleUsers(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string
  ) {
    const notifications = userIds.map(userId => ({
      user_id: userId,
      type,
      title,
      message,
      action_url: actionUrl,
      is_read: false
    }))

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select()

    if (error) throw error
    return data
  }

  // Bulk notification for all users
  async notifyAllUsers(
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string
  ) {
    // Get all user IDs
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')

    if (usersError) throw usersError

    const userIds = users.map(user => user.id)
    return await this.notifyMultipleUsers(userIds, type, title, message, actionUrl)
  }
}

export const notificationService = new NotificationService()