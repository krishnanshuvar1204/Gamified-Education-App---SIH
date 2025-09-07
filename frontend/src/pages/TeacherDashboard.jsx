import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalStudents: 0,
    pendingSubmissions: 0,
    totalQuizzes: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks
      const tasksResponse = await axios.get('/api/tasks/my-tasks');
      const tasks = tasksResponse.data.data;
      
      // Fetch students
      const studentsResponse = await axios.get('/api/users/students');
      const students = studentsResponse.data.data;
      
      // Calculate stats
      const totalTasks = tasks.length;
      const totalStudents = students.length;
      const pendingSubmissions = tasks.reduce((count, task) => 
        count + task.submissions.filter(sub => sub.status === 'pending').length, 0
      );
      
      // Fetch quizzes
      const quizzesResponse = await axios.get('/api/quizzes/my-quizzes');
      const quizzes = quizzesResponse.data.data;
      
      setStats({
        totalTasks,
        totalStudents,
        pendingSubmissions,
        totalQuizzes: quizzes.length
      });
      
      setRecentTasks(tasks.slice(0, 5));
      
      // Get all pending submissions
      const allPendingSubmissions = [];
      tasks.forEach(task => {
        task.submissions
          .filter(sub => sub.status === 'pending')
          .forEach(sub => {
            allPendingSubmissions.push({
              ...sub,
              taskTitle: task.title,
              taskId: task.id || task._id
            });
          });
      });
      setPendingSubmissions(allPendingSubmissions.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmission = async (taskId, submissionId, status, feedback, pointsAwarded) => {
    try {
      console.log('Reviewing submission:', { taskId, submissionId, status, feedback, pointsAwarded });
      
      const response = await axios.put(`/api/tasks/${taskId}/review`, {
        submissionId,
        status,
        feedback,
        pointsAwarded
      });
      
      console.log('Review response:', response.data);
      
      // Refresh data
      fetchDashboardData();
      alert(`Submission ${status} successfully!`);
    } catch (error) {
      console.error('Error reviewing submission:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Error reviewing submission. Please try again.';
      alert(errorMessage);
    }
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
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your environmental education program
          </p>
        </div>


        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalStudents}</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pendingSubmissions}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalQuizzes}</div>
            <div className="stat-label">Quizzes</div>
          </div>
        </div>

        <div className="grid grid-2">
          {/* Recent Tasks */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">📋 Recent Tasks</h3>
            </div>
            <div className="card-body">
              {recentTasks.length === 0 ? (
                <p className="text-gray-500">No tasks created yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div key={task._id} className="border rounded p-3">
                      <h4 className="font-semibold mb-2">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="badge badge-info">{task.category}</span>
                        <span className="font-semibold">{task.points} points</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">
                          {task.submissions.length} submissions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Submissions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">⏳ Pending Reviews</h3>
            </div>
            <div className="card-body">
              {pendingSubmissions.length === 0 ? (
                <p className="text-gray-500">No pending submissions.</p>
              ) : (
                <div className="space-y-3">
                  {pendingSubmissions.map((submission) => (
                    <div key={`${submission.taskId}-${submission._id}`} className="border rounded p-3">
                      <h4 className="font-semibold mb-1">{submission.taskTitle}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Student: {submission.student?.name || 'Unknown'}
                      </p>
                      <p className="text-sm mb-3">{submission.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReviewSubmission(
                            submission.taskId,
                            submission.id || submission._id,
                            'approved',
                            'Great work!',
                            20
                          )}
                          className="btn btn-success btn-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewSubmission(
                            submission.taskId,
                            submission.id || submission._id,
                            'rejected',
                            'Please resubmit with more detail.',
                            0
                          )}
                          className="btn btn-danger btn-sm"
                        >
                          Reject
                        </button>
                      </div>
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
                Create New Task
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/quizzes')}
              >
                Create Quiz
              </button>
              <button 
                className="btn btn-success"
                onClick={() => navigate('/users')}
              >
                View All Students
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

