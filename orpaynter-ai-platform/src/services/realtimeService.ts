import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to user notifications
  static subscribeToUserNotifications(
    userId: string,
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ): RealtimeSubscription {
    const channelName = `user-notifications-${userId}`;
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification:', payload);
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Notification updated:', payload);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Notification deleted:', payload);
          onDelete?.(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  // Subscribe to user projects
  static subscribeToUserProjects(
    userId: string,
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ): RealtimeSubscription {
    const channelName = `user-projects-${userId}`;
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New project:', payload);
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Project updated:', payload);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Project deleted:', payload);
          onDelete?.(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  // Subscribe to user assessments
  static subscribeToUserAssessments(
    userId: string,
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ): RealtimeSubscription {
    const channelName = `user-assessments-${userId}`;
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('New assessment:', payload);
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Assessment updated:', payload);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Assessment deleted:', payload);
          onDelete?.(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  // Subscribe to contractor projects (for contractors to see assigned projects)
  static subscribeToContractorProjects(
    contractorId: string,
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ): RealtimeSubscription {
    const channelName = `contractor-projects-${contractorId}`;
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'projects',
          filter: `contractor_id=eq.${contractorId}`
        },
        (payload) => {
          console.log('New contractor project:', payload);
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `contractor_id=eq.${contractorId}`
        },
        (payload) => {
          console.log('Contractor project updated:', payload);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'projects',
          filter: `contractor_id=eq.${contractorId}`
        },
        (payload) => {
          console.log('Contractor project deleted:', payload);
          onDelete?.(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  // Subscribe to all assessments (for insurance companies)
  static subscribeToAllAssessments(
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ): RealtimeSubscription {
    const channelName = 'all-assessments';
    
    // Remove existing channel if it exists
    this.unsubscribe(channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assessments'
        },
        (payload) => {
          console.log('New assessment (all):', payload);
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assessments'
        },
        (payload) => {
          console.log('Assessment updated (all):', payload);
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'assessments'
        },
        (payload) => {
          console.log('Assessment deleted (all):', payload);
          onDelete?.(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return {
      channel,
      unsubscribe: () => this.unsubscribe(channelName)
    };
  }

  // Unsubscribe from a specific channel
  static unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      console.log(`Unsubscribed from channel: ${channelName}`);
    }
  }

  // Unsubscribe from all channels
  static unsubscribeAll(): void {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
      console.log(`Unsubscribed from channel: ${channelName}`);
    });
    this.channels.clear();
  }

  // Get active channels count
  static getActiveChannelsCount(): number {
    return this.channels.size;
  }

  // Get active channel names
  static getActiveChannelNames(): string[] {
    return Array.from(this.channels.keys());
  }
}

export default RealtimeService;