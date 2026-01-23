import { useEffect, useRef } from 'react';
import { RealtimeService, type RealtimeSubscription } from '../services/realtimeService';
import { useAuth } from './useAuth';

export interface UseRealtimeOptions {
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  enabled?: boolean;
}

// Hook for subscribing to user notifications
export function useNotificationsRealtime(options: UseRealtimeOptions = {}) {
  const { user } = useAuth();
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  const { onInsert, onUpdate, onDelete, enabled = true } = options;

  useEffect(() => {
    if (!user?.id || !enabled) {
      return;
    }

    // Subscribe to notifications
    subscriptionRef.current = RealtimeService.subscribeToUserNotifications(
      user.id,
      onInsert,
      onUpdate,
      onDelete
    );

    // Cleanup on unmount or dependency change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, enabled, onInsert, onUpdate, onDelete]);

  return {
    isSubscribed: !!subscriptionRef.current,
    unsubscribe: () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  };
}

// Hook for subscribing to user projects
export function useProjectsRealtime(options: UseRealtimeOptions = {}) {
  const { user } = useAuth();
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  const { onInsert, onUpdate, onDelete, enabled = true } = options;

  useEffect(() => {
    if (!user?.id || !enabled) {
      return;
    }

    // Subscribe to projects
    subscriptionRef.current = RealtimeService.subscribeToUserProjects(
      user.id,
      onInsert,
      onUpdate,
      onDelete
    );

    // Cleanup on unmount or dependency change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, enabled, onInsert, onUpdate, onDelete]);

  return {
    isSubscribed: !!subscriptionRef.current,
    unsubscribe: () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  };
}

// Hook for subscribing to user assessments
export function useAssessmentsRealtime(options: UseRealtimeOptions = {}) {
  const { user } = useAuth();
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  const { onInsert, onUpdate, onDelete, enabled = true } = options;

  useEffect(() => {
    if (!user?.id || !enabled) {
      return;
    }

    // Subscribe to assessments
    subscriptionRef.current = RealtimeService.subscribeToUserAssessments(
      user.id,
      onInsert,
      onUpdate,
      onDelete
    );

    // Cleanup on unmount or dependency change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, enabled, onInsert, onUpdate, onDelete]);

  return {
    isSubscribed: !!subscriptionRef.current,
    unsubscribe: () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  };
}

// Hook for contractors to subscribe to their assigned projects
export function useContractorProjectsRealtime(options: UseRealtimeOptions = {}) {
  const { user } = useAuth();
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  const { onInsert, onUpdate, onDelete, enabled = true } = options;

  useEffect(() => {
    if (!user?.id || user.user_metadata?.role !== 'contractor' || !enabled) {
      return;
    }

    // Subscribe to contractor projects
    subscriptionRef.current = RealtimeService.subscribeToContractorProjects(
      user.id,
      onInsert,
      onUpdate,
      onDelete
    );

    // Cleanup on unmount or dependency change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, user?.user_metadata?.role, enabled, onInsert, onUpdate, onDelete]);

  return {
    isSubscribed: !!subscriptionRef.current,
    unsubscribe: () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  };
}

// Hook for insurance companies to subscribe to all assessments
export function useAllAssessmentsRealtime(options: UseRealtimeOptions = {}) {
  const { user } = useAuth();
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  const { onInsert, onUpdate, onDelete, enabled = true } = options;

  useEffect(() => {
    if (!user?.id || user.user_metadata?.role !== 'insurance' || !enabled) {
      return;
    }

    // Subscribe to all assessments
    subscriptionRef.current = RealtimeService.subscribeToAllAssessments(
      onInsert,
      onUpdate,
      onDelete
    );

    // Cleanup on unmount or dependency change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, user?.user_metadata?.role, enabled, onInsert, onUpdate, onDelete]);

  return {
    isSubscribed: !!subscriptionRef.current,
    unsubscribe: () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  };
}

// Hook for managing multiple realtime subscriptions
export function useMultipleRealtime(subscriptions: {
  notifications?: UseRealtimeOptions;
  projects?: UseRealtimeOptions;
  assessments?: UseRealtimeOptions;
  contractorProjects?: UseRealtimeOptions;
  allAssessments?: UseRealtimeOptions;
}) {
  const notificationsRealtime = useNotificationsRealtime(subscriptions.notifications);
  const projectsRealtime = useProjectsRealtime(subscriptions.projects);
  const assessmentsRealtime = useAssessmentsRealtime(subscriptions.assessments);
  const contractorProjectsRealtime = useContractorProjectsRealtime(subscriptions.contractorProjects);
  const allAssessmentsRealtime = useAllAssessmentsRealtime(subscriptions.allAssessments);

  const unsubscribeAll = () => {
    notificationsRealtime.unsubscribe();
    projectsRealtime.unsubscribe();
    assessmentsRealtime.unsubscribe();
    contractorProjectsRealtime.unsubscribe();
    allAssessmentsRealtime.unsubscribe();
  };

  const activeSubscriptions = [
    notificationsRealtime.isSubscribed,
    projectsRealtime.isSubscribed,
    assessmentsRealtime.isSubscribed,
    contractorProjectsRealtime.isSubscribed,
    allAssessmentsRealtime.isSubscribed
  ].filter(Boolean).length;

  return {
    notifications: notificationsRealtime,
    projects: projectsRealtime,
    assessments: assessmentsRealtime,
    contractorProjects: contractorProjectsRealtime,
    allAssessments: allAssessmentsRealtime,
    activeSubscriptions,
    unsubscribeAll
  };
}

// Hook for cleanup on app unmount
export function useRealtimeCleanup() {
  useEffect(() => {
    return () => {
      // Cleanup all subscriptions when the app unmounts
      RealtimeService.unsubscribeAll();
    };
  }, []);
}

export default {
  useNotificationsRealtime,
  useProjectsRealtime,
  useAssessmentsRealtime,
  useContractorProjectsRealtime,
  useAllAssessmentsRealtime,
  useMultipleRealtime,
  useRealtimeCleanup
};