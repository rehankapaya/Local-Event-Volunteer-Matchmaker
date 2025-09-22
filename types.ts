
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
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  requiredSkills: string[];
  maxCapacity: number;
  registeredUsers: number;
  organizer: string;
  imageUrl: string;
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
