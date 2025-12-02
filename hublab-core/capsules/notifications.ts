/**
 * Notifications Capsule - Push & Local Notifications
 *
 * Cross-platform notification system with push notifications,
 * local scheduling, badges, and action buttons.
 */

import type { CapsuleDefinition } from './types'

export const NotificationsCapsule: CapsuleDefinition = {
  id: 'notifications',
  name: 'Notifications',
  description: 'Push and local notifications with scheduling, badges, and action buttons',
  category: 'device',
  tags: ['notifications', 'push', 'local', 'alerts', 'badges'],
  version: '1.0.0',

  props: {
    title: {
      type: 'string',
      required: true,
      description: 'Notification title',
    },
    body: {
      type: 'string',
      required: true,
      description: 'Notification body text',
    },
    icon: {
      type: 'string',
      description: 'Notification icon URL or name',
    },
    image: {
      type: 'string',
      description: 'Large image URL for expanded notification',
    },
    badge: {
      type: 'number',
      description: 'Badge count for app icon',
    },
    sound: {
      type: 'string',
      default: 'default',
      description: 'Sound to play: default, none, or custom sound name',
    },
    vibrate: {
      type: 'boolean',
      default: true,
      description: 'Enable vibration',
    },
    silent: {
      type: 'boolean',
      default: false,
      description: 'Silent notification (no sound/vibration)',
    },
    priority: {
      type: 'string',
      default: 'default',
      description: 'Priority: low, default, high, urgent',
    },
    channel: {
      type: 'string',
      default: 'default',
      description: 'Notification channel ID (Android)',
    },
    category: {
      type: 'string',
      description: 'Notification category for actions (iOS)',
    },
    actions: {
      type: 'array',
      description: 'Action buttons array',
    },
    data: {
      type: 'object',
      description: 'Custom data payload',
    },
    scheduledAt: {
      type: 'string',
      description: 'ISO date string for scheduled delivery',
    },
    repeatInterval: {
      type: 'string',
      description: 'Repeat interval: minute, hour, day, week, month',
    },
    tag: {
      type: 'string',
      description: 'Tag for grouping/replacing notifications',
    },
    groupId: {
      type: 'string',
      description: 'Group ID for notification stacking',
    },
    onPress: {
      type: 'function',
      description: 'Callback when notification is pressed',
    },
    onAction: {
      type: 'function',
      description: 'Callback when action button is pressed',
    },
    onDismiss: {
      type: 'function',
      description: 'Callback when notification is dismissed',
    },
  },

  platforms: {
    web: {
      dependencies: ['react', 'tailwindcss'],
      components: {
        // Notification Permission Request
        NotificationPermission: `
import React, { useState, useEffect, useCallback } from 'react';

interface NotificationPermissionProps {
  onGranted?: () => void;
  onDenied?: () => void;
  onError?: (error: Error) => void;
  autoRequest?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const NotificationPermission: React.FC<NotificationPermissionProps> = ({
  onGranted,
  onDenied,
  onError,
  autoRequest = false,
  children,
  className = '',
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);

      if (autoRequest && Notification.permission === 'default') {
        requestPermission();
      }
    }
  }, [autoRequest]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      onError?.(new Error('Notifications not supported'));
      return;
    }

    setIsRequesting(true);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        onGranted?.();
      } else {
        onDenied?.();
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Permission request failed'));
    } finally {
      setIsRequesting(false);
    }
  }, [onGranted, onDenied, onError]);

  if (permission === 'granted') {
    return <>{children}</>;
  }

  return (
    <div className={\`p-6 bg-white rounded-lg border border-gray-200 shadow-sm \${className}\`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Enable Notifications</h3>
          <p className="text-gray-600 text-sm mt-1">
            {permission === 'denied'
              ? 'Notifications are blocked. Please enable them in your browser settings.'
              : 'Stay updated with important alerts and messages.'}
          </p>

          {permission !== 'denied' && (
            <button
              onClick={requestPermission}
              disabled={isRequesting}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isRequesting ? 'Requesting...' : 'Enable Notifications'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
`,

        // Notification Manager Hook
        useNotifications: `
import { useState, useCallback, useEffect } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
  silent?: boolean;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  vibrate?: number[];
}

interface ScheduledNotification extends NotificationOptions {
  id: string;
  scheduledAt: Date;
  repeatInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (options: NotificationOptions) => Promise<Notification | null>;
  scheduleNotification: (options: NotificationOptions, date: Date, repeatInterval?: string) => string;
  cancelScheduledNotification: (id: string) => void;
  cancelAllNotifications: () => void;
  scheduledNotifications: ScheduledNotification[];
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [timers, setTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [isSupported]);

  const showNotification = useCallback(async (options: NotificationOptions): Promise<Notification | null> => {
    if (!isSupported || permission !== 'granted') {
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        image: options.image,
        badge: options.badge,
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
        vibrate: options.vibrate,
      });

      return notification;
    } catch (err) {
      console.error('Failed to show notification:', err);
      return null;
    }
  }, [isSupported, permission]);

  const scheduleNotification = useCallback((
    options: NotificationOptions,
    date: Date,
    repeatInterval?: string
  ): string => {
    const id = crypto.randomUUID();
    const delay = date.getTime() - Date.now();

    if (delay <= 0) {
      showNotification(options);
      return id;
    }

    const scheduleNext = (currentDate: Date) => {
      const timer = setTimeout(() => {
        showNotification(options);

        if (repeatInterval) {
          let nextDate = new Date(currentDate);
          switch (repeatInterval) {
            case 'minute':
              nextDate.setMinutes(nextDate.getMinutes() + 1);
              break;
            case 'hour':
              nextDate.setHours(nextDate.getHours() + 1);
              break;
            case 'day':
              nextDate.setDate(nextDate.getDate() + 1);
              break;
            case 'week':
              nextDate.setDate(nextDate.getDate() + 7);
              break;
            case 'month':
              nextDate.setMonth(nextDate.getMonth() + 1);
              break;
          }
          scheduleNext(nextDate);
        }
      }, currentDate.getTime() - Date.now());

      setTimers(prev => new Map(prev).set(id, timer));
    };

    scheduleNext(date);

    const scheduled: ScheduledNotification = {
      ...options,
      id,
      scheduledAt: date,
      repeatInterval: repeatInterval as ScheduledNotification['repeatInterval'],
    };

    setScheduledNotifications(prev => [...prev, scheduled]);

    return id;
  }, [showNotification]);

  const cancelScheduledNotification = useCallback((id: string) => {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      setTimers(prev => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    }
    setScheduledNotifications(prev => prev.filter(n => n.id !== id));
  }, [timers]);

  const cancelAllNotifications = useCallback(() => {
    timers.forEach(timer => clearTimeout(timer));
    setTimers(new Map());
    setScheduledNotifications([]);
  }, [timers]);

  useEffect(() => {
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    scheduleNotification,
    cancelScheduledNotification,
    cancelAllNotifications,
    scheduledNotifications,
  };
}
`,

        // Notification Toast Component
        NotificationToast: `
import React, { useState, useEffect } from 'react';

interface NotificationToastProps {
  title: string;
  body: string;
  icon?: React.ReactNode;
  image?: string;
  actions?: Array<{ id: string; label: string; variant?: 'primary' | 'secondary' }>;
  duration?: number;
  onAction?: (actionId: string) => void;
  onDismiss?: () => void;
  onPress?: () => void;
  variant?: 'info' | 'success' | 'warning' | 'error';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  body,
  icon,
  image,
  actions = [],
  duration = 5000,
  onAction,
  onDismiss,
  onPress,
  variant = 'info',
  position = 'top-right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration <= 0) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev - (100 / (duration / 100));
        if (next <= 0) {
          clearInterval(interval);
          handleDismiss();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  const variantStyles = {
    info: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
  };

  const variantIcon = {
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  if (!isVisible) return null;

  return (
    <div
      className={\`
        fixed z-50 w-96 max-w-[calc(100vw-2rem)]
        \${positionStyles[position]}
        transform transition-all duration-300
        \${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        \${className}
      \`}
    >
      <div
        className={\`
          relative overflow-hidden rounded-lg border shadow-lg
          \${variantStyles[variant]}
        \`}
      >
        {/* Content */}
        <div
          className="p-4 cursor-pointer"
          onClick={onPress}
        >
          <div className="flex gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              {icon || variantIcon[variant]}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{title}</p>
              <p className="text-sm text-gray-600 mt-0.5">{body}</p>

              {/* Image */}
              {image && (
                <img
                  src={image}
                  alt=""
                  className="mt-2 rounded-lg w-full h-32 object-cover"
                />
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {actions.map(action => (
                    <button
                      key={action.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction?.(action.id);
                      }}
                      className={\`
                        px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                        \${action.variant === 'primary'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }
                      \`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="flex-shrink-0 p-1 rounded hover:bg-black/5"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="h-1 bg-black/10">
            <div
              className="h-full bg-current opacity-30 transition-all duration-100 ease-linear"
              style={{ width: \`\${progress}%\` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
`,

        // Notification Center
        NotificationCenter: `
import React, { useState, useCallback } from 'react';

interface Notification {
  id: string;
  title: string;
  body: string;
  icon?: React.ReactNode;
  image?: string;
  timestamp: Date;
  read: boolean;
  category?: string;
  data?: Record<string, unknown>;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onRead?: (id: string) => void;
  onReadAll?: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  onPress?: (notification: Notification) => void;
  maxItems?: number;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onRead,
  onReadAll,
  onDelete,
  onClearAll,
  onPress,
  maxItems = 50,
  className = '',
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications
    .filter(n => filter === 'all' || !n.read)
    .slice(0, maxItems);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return \`\${minutes}m ago\`;
    if (hours < 24) return \`\${hours}h ago\`;
    if (days < 7) return \`\${days}d ago\`;
    return date.toLocaleDateString();
  };

  return (
    <div className={\`bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
            className="text-sm border-0 bg-transparent text-gray-600 focus:ring-0"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>

          {/* Mark all read */}
          {unreadCount > 0 && onReadAll && (
            <button
              onClick={onReadAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={\`
                relative flex gap-3 p-4 cursor-pointer transition-colors
                \${notification.read ? 'bg-white' : 'bg-blue-50'}
                hover:bg-gray-50
              \`}
              onClick={() => {
                if (!notification.read) onRead?.(notification.id);
                onPress?.(notification);
              }}
            >
              {/* Unread indicator */}
              {!notification.read && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
              )}

              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {notification.icon || (
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={\`font-medium text-gray-900 \${!notification.read ? 'font-semibold' : ''}\`}>
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">{notification.body}</p>
                <p className="text-xs text-gray-400 mt-1">{formatTime(notification.timestamp)}</p>
              </div>

              {/* Delete button */}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="flex-shrink-0 p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && onClearAll && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClearAll}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
};
`,
      },
    },

    ios: {
      dependencies: ['SwiftUI', 'UserNotifications'],
      minimumVersion: '15.0',
      components: {
        // Native Notification Manager
        NotificationManager: `
import SwiftUI
import UserNotifications

// MARK: - Notification Manager
@MainActor
class NotificationManager: NSObject, ObservableObject {
    static let shared = NotificationManager()

    @Published var isAuthorized = false
    @Published var pendingNotifications: [UNNotificationRequest] = []
    @Published var deliveredNotifications: [UNNotification] = []

    private let center = UNUserNotificationCenter.current()

    override init() {
        super.init()
        center.delegate = self
        checkAuthorization()
    }

    // Request permission
    func requestAuthorization() async -> Bool {
        do {
            let granted = try await center.requestAuthorization(
                options: [.alert, .badge, .sound, .provisional]
            )
            await MainActor.run {
                self.isAuthorized = granted
            }
            return granted
        } catch {
            print("Notification authorization error: \\(error)")
            return false
        }
    }

    // Check current authorization
    func checkAuthorization() {
        center.getNotificationSettings { settings in
            Task { @MainActor in
                self.isAuthorized = settings.authorizationStatus == .authorized
            }
        }
    }

    // Schedule local notification
    func scheduleNotification(
        id: String = UUID().uuidString,
        title: String,
        body: String,
        subtitle: String? = nil,
        badge: NSNumber? = nil,
        sound: UNNotificationSound? = .default,
        userInfo: [AnyHashable: Any] = [:],
        attachments: [UNNotificationAttachment] = [],
        categoryIdentifier: String? = nil,
        threadIdentifier: String? = nil,
        trigger: UNNotificationTrigger? = nil
    ) async throws -> String {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        if let subtitle = subtitle {
            content.subtitle = subtitle
        }
        if let badge = badge {
            content.badge = badge
        }
        if let sound = sound {
            content.sound = sound
        }
        content.userInfo = userInfo
        content.attachments = attachments
        if let categoryIdentifier = categoryIdentifier {
            content.categoryIdentifier = categoryIdentifier
        }
        if let threadIdentifier = threadIdentifier {
            content.threadIdentifier = threadIdentifier
        }

        let request = UNNotificationRequest(
            identifier: id,
            content: content,
            trigger: trigger
        )

        try await center.add(request)
        await refreshPendingNotifications()
        return id
    }

    // Schedule at specific date
    func scheduleAt(
        id: String = UUID().uuidString,
        title: String,
        body: String,
        date: Date,
        repeats: Bool = false
    ) async throws -> String {
        let components = Calendar.current.dateComponents(
            [.year, .month, .day, .hour, .minute, .second],
            from: date
        )
        let trigger = UNCalendarNotificationTrigger(
            dateMatching: components,
            repeats: repeats
        )

        return try await scheduleNotification(
            id: id,
            title: title,
            body: body,
            trigger: trigger
        )
    }

    // Schedule after interval
    func scheduleAfter(
        id: String = UUID().uuidString,
        title: String,
        body: String,
        interval: TimeInterval,
        repeats: Bool = false
    ) async throws -> String {
        let trigger = UNTimeIntervalNotificationTrigger(
            timeInterval: interval,
            repeats: repeats
        )

        return try await scheduleNotification(
            id: id,
            title: title,
            body: body,
            trigger: trigger
        )
    }

    // Cancel notification
    func cancel(id: String) {
        center.removePendingNotificationRequests(withIdentifiers: [id])
        center.removeDeliveredNotifications(withIdentifiers: [id])
        Task {
            await refreshPendingNotifications()
        }
    }

    // Cancel all notifications
    func cancelAll() {
        center.removeAllPendingNotificationRequests()
        center.removeAllDeliveredNotifications()
        Task {
            await refreshPendingNotifications()
        }
    }

    // Refresh pending notifications
    func refreshPendingNotifications() async {
        let pending = await center.pendingNotificationRequests()
        let delivered = await center.deliveredNotifications()

        await MainActor.run {
            self.pendingNotifications = pending
            self.deliveredNotifications = delivered
        }
    }

    // Set badge number
    func setBadge(_ count: Int) async throws {
        try await center.setBadgeCount(count)
    }

    // Register notification categories with actions
    func registerCategories(_ categories: Set<UNNotificationCategory>) {
        center.setNotificationCategories(categories)
    }
}

// MARK: - UNUserNotificationCenterDelegate
extension NotificationManager: UNUserNotificationCenterDelegate {
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification
    ) async -> UNNotificationPresentationOptions {
        return [.banner, .badge, .sound]
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse
    ) async {
        let userInfo = response.notification.request.content.userInfo
        let actionIdentifier = response.actionIdentifier

        // Handle action
        NotificationCenter.default.post(
            name: .didReceiveNotificationResponse,
            object: nil,
            userInfo: [
                "actionIdentifier": actionIdentifier,
                "userInfo": userInfo
            ]
        )
    }
}

// MARK: - Notification Names
extension Notification.Name {
    static let didReceiveNotificationResponse = Notification.Name("didReceiveNotificationResponse")
}

// MARK: - Notification Permission View
struct NotificationPermissionView: View {
    @StateObject private var manager = NotificationManager.shared
    @State private var isRequesting = false

    var onGranted: (() -> Void)?
    var onDenied: (() -> Void)?

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "bell.badge.fill")
                .font(.system(size: 60))
                .foregroundColor(.blue)
                .symbolRenderingMode(.hierarchical)

            Text("Enable Notifications")
                .font(.title2)
                .fontWeight(.bold)

            Text("Stay updated with important alerts, messages, and reminders.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            if manager.isAuthorized {
                Label("Notifications Enabled", systemImage: "checkmark.circle.fill")
                    .foregroundColor(.green)
            } else {
                Button(action: requestPermission) {
                    HStack {
                        if isRequesting {
                            ProgressView()
                                .tint(.white)
                        }
                        Text(isRequesting ? "Requesting..." : "Enable Notifications")
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                }
                .disabled(isRequesting)
                .padding(.horizontal)
            }
        }
        .padding()
    }

    private func requestPermission() {
        isRequesting = true
        Task {
            let granted = await manager.requestAuthorization()
            await MainActor.run {
                isRequesting = false
                if granted {
                    onGranted?()
                } else {
                    onDenied?()
                }
            }
        }
    }
}

// MARK: - Notification List View
struct NotificationListView: View {
    @StateObject private var manager = NotificationManager.shared

    var body: some View {
        List {
            if manager.pendingNotifications.isEmpty && manager.deliveredNotifications.isEmpty {
                ContentUnavailableView(
                    "No Notifications",
                    systemImage: "bell.slash",
                    description: Text("You're all caught up!")
                )
            }

            if !manager.pendingNotifications.isEmpty {
                Section("Scheduled") {
                    ForEach(manager.pendingNotifications, id: \\.identifier) { request in
                        NotificationRow(
                            title: request.content.title,
                            body: request.content.body,
                            isPending: true
                        )
                        .swipeActions {
                            Button("Cancel", role: .destructive) {
                                manager.cancel(id: request.identifier)
                            }
                        }
                    }
                }
            }

            if !manager.deliveredNotifications.isEmpty {
                Section("Delivered") {
                    ForEach(manager.deliveredNotifications, id: \\.request.identifier) { notification in
                        NotificationRow(
                            title: notification.request.content.title,
                            body: notification.request.content.body,
                            date: notification.date,
                            isPending: false
                        )
                    }
                }
            }
        }
        .navigationTitle("Notifications")
        .toolbar {
            if !manager.pendingNotifications.isEmpty || !manager.deliveredNotifications.isEmpty {
                Button("Clear All") {
                    manager.cancelAll()
                }
            }
        }
        .task {
            await manager.refreshPendingNotifications()
        }
    }
}

struct NotificationRow: View {
    let title: String
    let body: String
    var date: Date?
    let isPending: Bool

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(isPending ? Color.orange : Color.blue)
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)

                Text(body)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(2)

                if let date = date {
                    Text(date, style: .relative)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Usage Example
struct NotificationExampleView: View {
    @StateObject private var manager = NotificationManager.shared

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                NotificationPermissionView()

                if manager.isAuthorized {
                    Button("Send Test Notification") {
                        Task {
                            try? await manager.scheduleAfter(
                                title: "Hello!",
                                body: "This is a test notification",
                                interval: 3
                            )
                        }
                    }
                    .buttonStyle(.borderedProminent)

                    NavigationLink("View All Notifications") {
                        NotificationListView()
                    }
                }
            }
            .padding()
            .navigationTitle("Notifications")
        }
    }
}
`,
      },
    },

    android: {
      dependencies: [
        'androidx.compose.ui:ui',
        'androidx.compose.material3:material3',
        'androidx.core:core-ktx:1.12.0',
      ],
      minimumSdk: 24,
      components: {
        // Compose Notification Manager
        NotificationManager: `
package com.hublab.capsules.notifications

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.BitmapFactory
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import kotlinx.coroutines.delay
import java.util.*

// Data classes
data class NotificationData(
    val id: Int = Random().nextInt(),
    val channelId: String = "default",
    val title: String,
    val body: String,
    val smallIcon: Int,
    val largeIcon: Int? = null,
    val imageUrl: String? = null,
    val priority: Int = NotificationCompat.PRIORITY_DEFAULT,
    val autoCancel: Boolean = true,
    val ongoing: Boolean = false,
    val group: String? = null,
    val actions: List<NotificationAction> = emptyList(),
    val data: Map<String, String> = emptyMap()
)

data class NotificationAction(
    val id: String,
    val title: String,
    val icon: Int
)

data class NotificationChannel(
    val id: String,
    val name: String,
    val description: String,
    val importance: Int = NotificationManager.IMPORTANCE_DEFAULT
)

// Notification Helper
object NotificationHelper {
    private const val DEFAULT_CHANNEL_ID = "default"
    private const val DEFAULT_CHANNEL_NAME = "General"

    fun createChannel(
        context: Context,
        channel: NotificationChannel
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationChannel = android.app.NotificationChannel(
                channel.id,
                channel.name,
                channel.importance
            ).apply {
                description = channel.description
            }

            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(notificationChannel)
        }
    }

    fun createDefaultChannel(context: Context) {
        createChannel(
            context,
            NotificationChannel(
                id = DEFAULT_CHANNEL_ID,
                name = DEFAULT_CHANNEL_NAME,
                description = "General notifications",
                importance = NotificationManager.IMPORTANCE_DEFAULT
            )
        )
    }

    fun show(
        context: Context,
        notification: NotificationData
    ): Int {
        // Create channel if needed
        createDefaultChannel(context)

        val builder = NotificationCompat.Builder(context, notification.channelId)
            .setSmallIcon(notification.smallIcon)
            .setContentTitle(notification.title)
            .setContentText(notification.body)
            .setPriority(notification.priority)
            .setAutoCancel(notification.autoCancel)
            .setOngoing(notification.ongoing)

        // Large icon
        notification.largeIcon?.let { iconRes ->
            val bitmap = BitmapFactory.decodeResource(context.resources, iconRes)
            builder.setLargeIcon(bitmap)
        }

        // Group
        notification.group?.let { group ->
            builder.setGroup(group)
        }

        // Actions
        notification.actions.forEach { action ->
            val intent = Intent(context, NotificationActionReceiver::class.java).apply {
                this.action = action.id
                putExtra("notification_id", notification.id)
                notification.data.forEach { (key, value) ->
                    putExtra(key, value)
                }
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                action.id.hashCode(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            builder.addAction(action.icon, action.title, pendingIntent)
        }

        // Show notification
        if (hasPermission(context)) {
            NotificationManagerCompat.from(context).notify(notification.id, builder.build())
        }

        return notification.id
    }

    fun cancel(context: Context, id: Int) {
        NotificationManagerCompat.from(context).cancel(id)
    }

    fun cancelAll(context: Context) {
        NotificationManagerCompat.from(context).cancelAll()
    }

    fun hasPermission(context: Context): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }
}

// Notification Permission Composable
@Composable
fun NotificationPermissionRequest(
    onGranted: () -> Unit = {},
    onDenied: () -> Unit = {}
) {
    val context = LocalContext.current
    var hasPermission by remember {
        mutableStateOf(NotificationHelper.hasPermission(context))
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission = granted
        if (granted) onGranted() else onDenied()
    }

    if (!hasPermission && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.Notifications,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = MaterialTheme.colorScheme.primary
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Enable Notifications",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Stay updated with important alerts and messages.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = {
                        permissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                    }
                ) {
                    Text("Enable Notifications")
                }
            }
        }
    } else if (hasPermission) {
        LaunchedEffect(Unit) {
            onGranted()
        }
    }
}

// Notification Center Composable
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationCenter(
    notifications: List<NotificationItem>,
    onNotificationClick: (NotificationItem) -> Unit = {},
    onMarkAsRead: (String) -> Unit = {},
    onDelete: (String) -> Unit = {},
    onClearAll: () -> Unit = {}
) {
    var showUnreadOnly by remember { mutableStateOf(false) }

    val filteredNotifications = if (showUnreadOnly) {
        notifications.filter { !it.read }
    } else {
        notifications
    }

    val unreadCount = notifications.count { !it.read }

    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        TopAppBar(
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Notifications")
                    if (unreadCount > 0) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Badge {
                            Text(unreadCount.toString())
                        }
                    }
                }
            },
            actions = {
                // Filter toggle
                FilterChip(
                    selected = showUnreadOnly,
                    onClick = { showUnreadOnly = !showUnreadOnly },
                    label = { Text("Unread") }
                )

                // Clear all
                if (notifications.isNotEmpty()) {
                    IconButton(onClick = onClearAll) {
                        Icon(Icons.Default.ClearAll, "Clear all")
                    }
                }
            }
        )

        // Notification list
        if (filteredNotifications.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.NotificationsOff,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = MaterialTheme.colorScheme.outline
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "No notifications",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.outline
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(vertical = 8.dp)
            ) {
                items(
                    items = filteredNotifications,
                    key = { it.id }
                ) { notification ->
                    NotificationListItem(
                        notification = notification,
                        onClick = { onNotificationClick(notification) },
                        onMarkAsRead = { onMarkAsRead(notification.id) },
                        onDelete = { onDelete(notification.id) }
                    )
                }
            }
        }
    }
}

data class NotificationItem(
    val id: String,
    val title: String,
    val body: String,
    val timestamp: Long,
    val read: Boolean = false,
    val icon: @Composable (() -> Unit)? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun NotificationListItem(
    notification: NotificationItem,
    onClick: () -> Unit,
    onMarkAsRead: () -> Unit,
    onDelete: () -> Unit
) {
    val dismissState = rememberSwipeToDismissBoxState(
        confirmValueChange = { value ->
            when (value) {
                SwipeToDismissBoxValue.EndToStart -> {
                    onDelete()
                    true
                }
                SwipeToDismissBoxValue.StartToEnd -> {
                    onMarkAsRead()
                    true
                }
                else -> false
            }
        }
    )

    SwipeToDismissBox(
        state = dismissState,
        backgroundContent = {
            val color = when (dismissState.targetValue) {
                SwipeToDismissBoxValue.EndToStart -> MaterialTheme.colorScheme.errorContainer
                SwipeToDismissBoxValue.StartToEnd -> MaterialTheme.colorScheme.primaryContainer
                else -> MaterialTheme.colorScheme.surface
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(color)
                    .padding(horizontal = 20.dp),
                contentAlignment = when (dismissState.targetValue) {
                    SwipeToDismissBoxValue.EndToStart -> Alignment.CenterEnd
                    else -> Alignment.CenterStart
                }
            ) {
                Icon(
                    imageVector = when (dismissState.targetValue) {
                        SwipeToDismissBoxValue.EndToStart -> Icons.Default.Delete
                        else -> Icons.Default.Done
                    },
                    contentDescription = null
                )
            }
        }
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            onClick = onClick,
            colors = CardDefaults.cardColors(
                containerColor = if (notification.read)
                    MaterialTheme.colorScheme.surface
                else
                    MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
            )
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.Top
            ) {
                // Unread indicator
                if (!notification.read) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .background(
                                MaterialTheme.colorScheme.primary,
                                shape = androidx.compose.foundation.shape.CircleShape
                            )
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                }

                // Icon
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(
                            MaterialTheme.colorScheme.secondaryContainer,
                            shape = androidx.compose.foundation.shape.CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    notification.icon?.invoke() ?: Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                // Content
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = notification.title,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = if (notification.read) FontWeight.Normal else FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = notification.body,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = formatTimestamp(notification.timestamp),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.outline
                    )
                }
            }
        }
    }
}

private fun formatTimestamp(timestamp: Long): String {
    val now = System.currentTimeMillis()
    val diff = now - timestamp

    return when {
        diff < 60_000 -> "Just now"
        diff < 3600_000 -> "\${diff / 60_000}m ago"
        diff < 86400_000 -> "\${diff / 3600_000}h ago"
        diff < 604800_000 -> "\${diff / 86400_000}d ago"
        else -> java.text.SimpleDateFormat("MMM d", java.util.Locale.getDefault())
            .format(java.util.Date(timestamp))
    }
}

// Broadcast receiver for notification actions (needs to be registered in AndroidManifest.xml)
class NotificationActionReceiver : android.content.BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        val notificationId = intent.getIntExtra("notification_id", -1)

        // Handle the action
        when (action) {
            "ACTION_MARK_READ" -> {
                // Handle mark as read
            }
            "ACTION_REPLY" -> {
                // Handle reply
            }
            "ACTION_DISMISS" -> {
                if (notificationId != -1) {
                    NotificationHelper.cancel(context, notificationId)
                }
            }
        }
    }
}
`,
      },
    },

    desktop: {
      dependencies: ['tauri', 'react', 'tailwindcss'],
      components: {
        // Desktop Notification Manager
        DesktopNotifications: `
import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';

// Types
interface DesktopNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  image?: string;
  timestamp: Date;
  read: boolean;
  actions?: Array<{ id: string; label: string }>;
  data?: Record<string, unknown>;
}

interface NotificationContextType {
  notifications: DesktopNotification[];
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  show: (notification: Omit<DesktopNotification, 'id' | 'timestamp' | 'read'>) => Promise<string>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

declare global {
  interface Window {
    __TAURI__?: {
      notification: {
        requestPermission: () => Promise<'granted' | 'denied'>;
        isPermissionGranted: () => Promise<boolean>;
        sendNotification: (options: { title: string; body: string; icon?: string }) => void;
      };
    };
  }
}

// Context
const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Provider
interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  persistKey?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 100,
  persistKey = 'hublab_notifications',
}) => {
  const [notifications, setNotifications] = useState<DesktopNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        return JSON.parse(saved).map((n: DesktopNotification) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    }
    return [];
  });

  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Check permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem(persistKey, JSON.stringify(notifications));
  }, [notifications, persistKey]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (window.__TAURI__) {
      const result = await window.__TAURI__.notification.requestPermission();
      const perm = result === 'granted' ? 'granted' : 'denied';
      setPermission(perm);
      return perm;
    }

    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }

    return 'denied';
  }, []);

  const show = useCallback(async (
    notification: Omit<DesktopNotification, 'id' | 'timestamp' | 'read'>
  ): Promise<string> => {
    const id = crypto.randomUUID();
    const newNotification: DesktopNotification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
    };

    // Add to state
    setNotifications(prev => [newNotification, ...prev].slice(0, maxNotifications));

    // Show native notification
    if (permission === 'granted') {
      if (window.__TAURI__) {
        window.__TAURI__.notification.sendNotification({
          title: notification.title,
          body: notification.body,
          icon: notification.icon,
        });
      } else if ('Notification' in window) {
        new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon,
          image: notification.image,
        });
      }
    }

    return id;
  }, [permission, maxNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        permission,
        requestPermission,
        show,
        markAsRead,
        markAllAsRead,
        remove,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Button
interface NotificationBellProps {
  onClick?: () => void;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onClick,
  className = '',
}) => {
  const { unreadCount } = useNotifications();

  return (
    <button
      onClick={onClick}
      className={\`relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 \${className}\`}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

// Notification Panel
interface NotificationPanelProps {
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  className = '',
}) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    remove,
    clearAll,
    unreadCount,
  } = useNotifications();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return \`\${minutes}m ago\`;
    if (hours < 24) return \`\${hours}h ago\`;
    if (days < 7) return \`\${days}d ago\`;
    return date.toLocaleDateString();
  };

  return (
    <div className={\`w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden \${className}\`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={\`
                relative flex gap-3 p-4 border-b border-gray-100 dark:border-gray-800
                cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50
                \${notification.read ? '' : 'bg-blue-50/50 dark:bg-blue-900/10'}
              \`}
              onClick={() => markAsRead(notification.id)}
            >
              {!notification.read && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
              )}

              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                {notification.icon ? (
                  <img src={notification.icon} alt="" className="w-6 h-6 rounded" />
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={\`font-medium text-gray-900 dark:text-white \${!notification.read ? 'font-semibold' : ''}\`}>
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {notification.body}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(notification.timestamp)}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(notification.id);
                }}
                className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
};
`,
      },
    },
  },

  examples: [
    {
      title: 'Request Permission',
      description: 'Request notification permission from user',
      code: `
<NotificationPermission
  onGranted={() => console.log('Notifications enabled!')}
  onDenied={() => console.log('Permission denied')}
  autoRequest={false}
>
  <App />
</NotificationPermission>
`,
    },
    {
      title: 'Show Notification',
      description: 'Display a notification with the hook',
      code: `
const { showNotification } = useNotifications();

await showNotification({
  title: 'New Message',
  body: 'You have received a new message',
  icon: '/icon.png',
});
`,
    },
    {
      title: 'Notification Toast',
      description: 'In-app notification toast',
      code: `
<NotificationToast
  title="Order Confirmed"
  body="Your order #12345 has been confirmed"
  variant="success"
  duration={5000}
  actions={[
    { id: 'view', label: 'View Order', variant: 'primary' },
    { id: 'dismiss', label: 'Dismiss' }
  ]}
  onAction={(id) => handleAction(id)}
/>
`,
    },
    {
      title: 'Notification Center',
      description: 'Full notification center UI',
      code: `
<NotificationCenter
  notifications={notifications}
  onRead={(id) => markAsRead(id)}
  onReadAll={() => markAllAsRead()}
  onDelete={(id) => deleteNotification(id)}
  onClearAll={() => clearAll()}
  onPress={(notification) => handlePress(notification)}
/>
`,
    },
  ],
}
