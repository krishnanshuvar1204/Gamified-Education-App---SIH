import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import LevelDisplay from '../components/LevelDisplay';
import VirtualGarden from '../components/VirtualGarden';
import EcoBuddy from '../components/EcoBuddy';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalPoints: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks
      const tasksResponse = await axios.get('/api/tasks/my-tasks');
      const tasks = tasksResponse.data.data;
      
      // Calculate stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => 
        task.submissions.some(sub => 
          sub.student === user.id && sub.status === 'approved'
        )
      ).length;
      const pendingTasks = tasks.filter(task => 
        task.submissions.some(sub => 
          sub.student === user.id && sub.status === 'pending'
        )
      ).length;
      
      // Fetch leaderboard
      const leaderboardResponse = await axios.get('/api/users/leaderboard');
      
      setStats({
        totalTasks,
        completedTasks,
        pendingTasks,
        totalPoints: user.xp || user.points || 0
      });
      
      setRecentTasks(tasks.slice(0, 5));
      setLeaderboard(leaderboardResponse.data.data.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskStatus = (task) => {
    const submission = task.submissions.find(sub => sub.student === user.id);
    if (!submission) return 'not-started';
    return submission.status;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-success">Completed</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending Review</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-info">Not Started</span>;
    }
  };

  const handleAttemptTask = (task) => {
    // Navigate to task details or submission page
    navigate(`/tasks/${task.id || task._id}`);
  };

  const handleSubmitTask = () => {
    // Navigate to tasks page where they can select a task to submit
    navigate('/tasks');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user.name}!</h1>
          <p className="dashboard-subtitle">
            Continue your environmental education journey
          </p>
        </div>

        {/* Level Display */}
        <div className="level-section">
          <LevelDisplay user={user} size="large" />
        </div>

        {/* Virtual Garden */}
        <VirtualGarden user={user} />

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{user.levelInfo?.totalXP || user.xp || user.points || 0}</div>
            <div className="stat-label">Total XP</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{user.levelInfo?.currentRank?.replace(/🌱|🌿|🌳|🌲|🏞️|🌍|🌟/g, '').trim() || 'Seedling'}</div>
            <div className="stat-label">Current Rank</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="card-title">🏆 Your Badges</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-3">
                {user.badges.map((badge, index) => (
                  <div key={index} className="text-center p-3 border rounded">
                    <div className="text-2xl mb-2">🏅</div>
                    <div className="font-semibold">{badge.name}</div>
                    <div className="text-sm text-gray-600">{badge.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-2">
          {/* Recent Tasks */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📋 Recent Tasks</h3>
            </div>
            <div className="card-body">
              {recentTasks.length === 0 ? (
                <p className="text-gray-500">No tasks assigned yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => {
                    const status = getTaskStatus(task);
                    return (
                      <div key={task._id} className="border rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{task.title}</h4>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="badge badge-info">{task.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{task.points} points</span>
                            {status === 'not-started' && (
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleAttemptTask(task)}
                              >
                                Attempt
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🏆 Leaderboard</h3>
            </div>
            <div className="card-body">
              {leaderboard.length === 0 ? (
                <p className="text-gray-500">No data available.</p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((student, index) => (
                    <div 
                      key={student._id} 
                      className={`flex justify-between items-center p-2 rounded ${
                        student._id === user.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-bold text-lg mr-2">
                          {index + 1}
                        </span>
                        <span className={student._id === user.id ? 'font-semibold' : ''}>
                          {student.name}
                        </span>
                        {student._id === user.id && (
                          <span className="ml-2 text-blue-600 text-sm">(You)</span>
                        )}
                      </div>
                      <span className="font-semibold">{student.points} pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mt-6">
          <div className="card-header">
            <h3 className="card-title">🚀 Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-3">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/tasks')}
              >
                View All Tasks
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/quizzes')}
              >
                Take a Quiz
              </button>
              <button 
                className="btn btn-success"
                onClick={handleSubmitTask}
              >
                Submit Task
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Eco Buddy - Fixed position floating character */}
      <EcoBuddy />
    </div>
  );
};

export default StudentDashboard;


