import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, EventCategory, User } from '../types';
import { storageService } from '../services/storageService';

const RegisterPage: React.FC = () => {
  const roles = Object.values(UserRole).filter(role => role !== UserRole.Admin);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    bio: '',
    location: '',
    skills: '',
    interests: [] as EventCategory[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const interest = value as EventCategory;
    setFormData(prev => {
      const newInterests = checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest);
      return { ...prev, interests: newInterests };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
      bio: formData.bio,
      interests: formData.interests,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      location: formData.location,
      avatarUrl: `https://picsum.photos/seed/${formData.name.replace(/\s/g, '')}/200`,
      // FIX: Add missing properties to conform to the User type.
      registeredEvents: [],
      pendingEvents: [],
    };

    storageService.addUser(newUser);
    storageService.setCurrentUser(newUser);

    // Using window.location to force a full app reload and update header state
    window.location.href = '#/dashboard';
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our community and start making an impact!
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Account Details */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">Account Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="sr-only">Full Name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required value={formData.name} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Full Name" />
                </div>
                <div>
                  <label htmlFor="role" className="sr-only">I am a...</label>
                  <select id="role" name="role" required value={formData.role} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-white placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                    <option value="" disabled>I am a...</option>
                    {roles.map(role => (
                      <option key={role} value={role}>{role.charAt(0) + role.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Password" />
            </div>
          </fieldset>

          {/* Profile Details */}
          <fieldset className="space-y-4 pt-6 border-t border-gray-200">
             <legend className="text-lg font-semibold text-gray-800">Profile Details</legend>
              <p className="text-sm text-gray-500 -mt-2">This helps us recommend the best opportunities for you.</p>
              <div>
                <label htmlFor="bio" className="sr-only">Bio</label>
                <textarea id="bio" name="bio" rows={3} value={formData.bio} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="A little about yourself..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="sr-only">Location</label>
                    <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Your City or Location" />
                  </div>
                  <div>
                    <label htmlFor="skills" className="sr-only">Skills</label>
                    <input id="skills" name="skills" type="text" value={formData.skills} onChange={handleChange} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Skills (e.g., Cooking, Coding)" />
                  </div>
              </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests / Preferred Causes</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.values(EventCategory).map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors">
                        <input type="checkbox" value={category} checked={formData.interests.includes(category)} onChange={handleInterestChange} className="rounded text-primary focus:ring-primary" />
                        <span className="text-gray-600">{category}</span>
                      </label>
                    ))}
                  </div>
              </div>
          </fieldset>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
              Create Account
            </button>
          </div>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-secondary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;