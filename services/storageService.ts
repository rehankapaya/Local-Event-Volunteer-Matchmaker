
import { User, Event, VolunteerStat, Notification, NotificationType } from '../types';
import { mockUsers, mockEvents, mockVolunteerStats, mockNotifications } from '../data/mockData';

const USERS_KEY = 'connecthub_users';
const EVENTS_KEY = 'connecthub_events';
const CURRENT_USER_KEY = 'connecthub_currentUser';
const NOTIFICATIONS_KEY = 'connecthub_notifications';

const get = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return null;
  }
};

const set = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const storageService = {
  initializeData: (): void => {
    if (!localStorage.getItem(USERS_KEY)) {
      set(USERS_KEY, mockUsers);
    }
    if (!localStorage.getItem(EVENTS_KEY)) {
      set(EVENTS_KEY, mockEvents);
    }
    if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
      set(NOTIFICATIONS_KEY, mockNotifications);
    }
  },

  // User Management
  getUsers: (): User[] => get<User[]>(USERS_KEY) || [],
  getUserById: (userId: string): User | undefined => {
    return storageService.getUsers().find(u => u.id === userId);
  },
  addUser: (user: User): void => {
    const users = storageService.getUsers();
    set(USERS_KEY, [...users, user]);
  },
  getCurrentUser: (): User | null => get<User>(CURRENT_USER_KEY),
  setCurrentUser: (user: User): void => {
    set(CURRENT_USER_KEY, user);
  },
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Event Management
  getEvents: (): Event[] => get<Event[]>(EVENTS_KEY) || [],
  addEvent: (event: Event): void => {
    const events = storageService.getEvents();
    set(EVENTS_KEY, [event, ...events]);
  },
  updateEvent: (updatedEvent: Event): void => {
    let events = storageService.getEvents();
    events = events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
    set(EVENTS_KEY, events);
  },
  deleteEvent: (eventId: string): void => {
    let events = storageService.getEvents();
    const eventToDelete = events.find(event => event.id === eventId);
    
    if (eventToDelete) {
      // Create cancellation notifications for all participants
      const participants = [...eventToDelete.attendees, ...eventToDelete.volunteers, ...eventToDelete.pendingVolunteers];
      participants.forEach(userId => {
        const notification: Notification = {
          id: `n${Date.now()}_${userId}`,
          userId,
          message: `The event "${eventToDelete.title}" has been cancelled by the organizer.`,
          type: NotificationType.CANCELLATION,
          eventId: eventToDelete.id,
          read: false,
          timestamp: new Date().toISOString(),
        };
        storageService.addNotification(notification);
      });

      // TODO: Also remove event from users' registered/pending lists
    }

    events = events.filter(event => event.id !== eventId);
    set(EVENTS_KEY, events);
  },

  // Notification Management
  getNotifications: (): Notification[] => get<Notification[]>(NOTIFICATIONS_KEY) || [],
  getNotificationsForUser: (userId: string): Notification[] => {
    const allNotifications = storageService.getNotifications();
    return allNotifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  addNotification: (notification: Notification): void => {
    const notifications = storageService.getNotifications();
    set(NOTIFICATIONS_KEY, [notification, ...notifications]);
  },
  markNotificationsAsRead: (userId: string): void => {
      let notifications = storageService.getNotifications();
      notifications = notifications.map(n => n.userId === userId ? { ...n, read: true } : n);
      set(NOTIFICATIONS_KEY, notifications);
  },

  // Stats
  getVolunteerStats: (): VolunteerStat => mockVolunteerStats, // Stays mock for simplicity
};
