import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CreateEventPage from './pages/CreateEventPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditEventPage from './pages/EditEventPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create" element={<CreateEventPage />} />
            <Route path="/edit/:id" element={<EditEventPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;