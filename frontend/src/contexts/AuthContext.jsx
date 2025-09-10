import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import axios from '../config/axios';
import LevelUpModal from '../components/LevelUpModal';
import XPGainAnimation from '../components/XPGainAnimation';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [xpGained, setXpGained] = useState(0);

  // Set up axios interceptor
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await axios.get('/api/auth/me');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.data.user,
              token: state.token
            }
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.data
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role
      });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.data
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    // Check for level up
    if (state.user && userData.levelInfo && state.user.levelInfo) {
      const oldLevel = state.user.levelInfo.currentLevel;
      const newLevel = userData.levelInfo.currentLevel;
      
      if (newLevel > oldLevel) {
        setLevelUpData({
          oldLevel,
          newLevel,
          newRank: userData.levelInfo.currentRank
        });
        setShowLevelUpModal(true);
      }
      
      // Check for XP gain
      const oldXP = state.user.levelInfo.totalXP || 0;
      const newXP = userData.levelInfo.totalXP || 0;
      const xpDiff = newXP - oldXP;
      
      if (xpDiff > 0) {
        setXpGained(xpDiff);
      }
    }
    
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Level Up Modal */}
      {showLevelUpModal && levelUpData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          newRank={levelUpData.newRank}
        />
      )}
      
      {/* XP Gain Animation */}
      <XPGainAnimation
        xpGained={xpGained}
        onComplete={() => setXpGained(0)}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


