import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../config/axios';

export const useXPUpdates = () => {
  const { user, updateUser } = useAuth();

  const refreshUserData = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.success) {
        updateUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const handleTaskCompletion = async (pointsEarned) => {
    if (pointsEarned > 0) {
      // Refresh user data to get updated XP and level
      await refreshUserData();
    }
  };

  const handleQuizCompletion = async (pointsEarned) => {
    if (pointsEarned > 0) {
      // Refresh user data to get updated XP and level
      await refreshUserData();
    }
  };

  const handleResourceCompletion = async () => {
    // Refresh user data to get updated XP and level
    await refreshUserData();
  };

  return {
    refreshUserData,
    handleTaskCompletion,
    handleQuizCompletion,
    handleResourceCompletion
  };
};
