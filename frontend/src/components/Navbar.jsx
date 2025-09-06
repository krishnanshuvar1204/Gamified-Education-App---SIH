import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🌱 Nexora
        </Link>
        
        <nav className="nav">
          <Link to="/">Dashboard</Link>
          
          {user?.role === 'student' && (
            <>
              <Link to="/tasks">My Tasks</Link>
              <Link to="/quizzes">Quizzes</Link>
              <Link to="/leaderboard">Leaderboard</Link>
            </>
          )}
          
          {user?.role === 'teacher' && (
            <>
              <Link to="/tasks">Manage Tasks</Link>
              <Link to="/quizzes">Manage Quizzes</Link>
              <Link to="/students">Students</Link>
            </>
          )}
          
          {user?.role === 'admin' && (
            <>
              <Link to="/users">Users</Link>
              <Link to="/tasks">Tasks</Link>
              <Link to="/quizzes">Quizzes</Link>
            </>
          )}
        </nav>
        
        <div className="user-info">
          {user?.role === 'student' && (
            <div className="points-badge">
              {user.points} points
            </div>
          )}
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

