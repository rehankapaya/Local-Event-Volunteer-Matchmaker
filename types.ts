
export enum UserRole {
  Volunteer = 'VOLUNTEER',
  Attendee = 'ATTENDEE',
  Organizer = 'ORGANIZER',
  Admin = 'ADMIN',
}

export enum EventCategory {
  Environment = 'Environment',
  Community = 'Community',
  Education = 'Education',
  Health = 'Health',
  Animals = 'Animals',
  Arts = 'Arts & Culture',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string;
  interests: EventCategory[];
  skills: string[];
  location: string;
  avatarUrl: string;
  registeredEvents: { eventId: string; role: 'attendee' | 'volunteer' }[];
  pendingEvents: { eventId: string; role: 'volunteer' }[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: EventCategory;
  requiredSkills: string[];
  maxCapacity: number;
  organizer: string;
  imageUrl: string;
  attendees: string[]; // user IDs
  volunteers: string[]; // user IDs of approved volunteers
  pendingVolunteers: string[]; // user IDs of volunteers pending approval
  waitlist: string[]; // user IDs
  status: 'pending' | 'approved';
  isMicro?: boolean;
}

export interface VolunteerStat {
  totalHours: number;
  causesSupported: number;
  eventsVolunteered: number;
  badges: string[];
}

export interface AIRecommendation {
  eventId: string;
  reason: string;
  event?: Event;
}

export enum NotificationType {
  REMINDER = 'REMINDER',
  CANCELLATION = 'CANCELLATION',
  THANK_YOU = 'THANK_YOU',
  VOLUNTEER_APPROVED = 'VOLUNTEER_APPROVED',
  VOLUNTEER_DENIED = 'VOLUNTEER_DENIED',
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: NotificationType;
  eventId?: string;
  read: boolean;
  timestamp: string;
}

export interface Filters {
  keyword: string;
  date: 'any' | 'today' | 'week' | 'month';
  categories: EventCategory[];
  distance: number; // 0 for any, or km value
  isMicro: boolean;
}