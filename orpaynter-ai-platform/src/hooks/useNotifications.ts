import { useState, useEffect } from 'react'
import { supabaseDataService } from '../services/supabaseData'
import { useAuth } from './useAuth'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  action_url?: string
  metadata?: any
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await supabaseDataService.getUserNotifications(user.id)
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
      setError(null)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await supabaseDataService.markNotificationAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return

    try {
      await supabaseDataService.markAllNotificationsAsRead(user.id)
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await supabaseDataService.deleteNotification(notificationId)
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      )
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId)
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  // Real-time subscription
  useEffect(() => {
    if (!user) return

    const subscription = supabaseDataService.subscribeToUserNotifications(
      user.id,
      (payload) => {
        console.log('Notification update:', payload)
        
        switch (payload.eventType) {
          case 'INSERT':
            setNotifications(prev => [payload.new, ...prev])
            if (!payload.new.read) {
              setUnreadCount(prev => prev + 1)
            }
            break
          case 'UPDATE':
            setNotifications(prev => 
              prev.map(notification => 
                notification.id === payload.new.id ? payload.new : notification
              )
            )
            // Update unread count based on read status change
            const oldNotification = notifications.find(n => n.id === payload.new.id)
            if (oldNotification && !oldNotification.read && payload.new.read) {
              setUnreadCount(prev => Math.max(0, prev - 1))
            } else if (oldNotification && oldNotification.read && !payload.new.read) {
              setUnreadCount(prev => prev + 1)
            }
            break
          case 'DELETE':
            setNotifications(prev => 
              prev.filter(notification => notification.id !== payload.old.id)
            )
            if (!payload.old.read) {
              setUnreadCount(prev => Math.max(0, prev - 1))
            }
            break
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [user, notifications])

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [user])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  }
}