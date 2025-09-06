import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionData, setSubmissionData] = useState({ description: '', file: null });
  const [newTask, setNewTask] = useState({ title: '', description: '', category: 'recycling', points: 10, difficulty: 'easy', dueDate: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating task with data:', newTask);
      const response = await axios.post('/api/tasks', newTask);
      console.log('Task created successfully:', response.data);
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', category: 'recycling', points: 10, difficulty: 'easy', dueDate: '' });
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error creating task:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Error creating task. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        fetchTasks(); // Refresh the list
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleSubmitTask = async (task) => {
    setSelectedTask(task);
    setShowSubmissionModal(true);
  };

  const handleSubmissionSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting task:', selectedTask);
      console.log('Submission data:', submissionData);
      
      // For demo server, send as JSON instead of FormData
      const submissionPayload = {
        taskId: selectedTask.id || selectedTask._id,
        description: submissionData.description
      };
      
      console.log('Sending payload:', submissionPayload);
      
      const response = await axios.post('/api/tasks/submit', submissionPayload);
      console.log('Submission response:', response.data);
      
      setShowSubmissionModal(false);
      setSubmissionData({ description: '', file: null });
      setSelectedTask(null);
      fetchTasks();
      alert('Task submitted successfully!');
    } catch (error) {
      console.error('Error submitting task:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Error submitting task. Please try again.';
      alert(errorMessage);
    }
  };

  const getTaskStatus = (task) => {
    if (!user || !task.submissions) return 'not-started';
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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.isActive !== false;
    if (filter === 'inactive') return task.isActive === false;
    return true;
  });

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
          <h1 className="dashboard-title">Tasks Management</h1>
          <p className="dashboard-subtitle">
            Manage all environmental education tasks
          </p>
        </div>

        {/* Filter Controls */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex gap-4 items-center">
              <label className="font-semibold">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto' }}
              >
                <option value="all">All Tasks</option>
                <option value="active">Active Tasks</option>
                <option value="inactive">Inactive Tasks</option>
              </select>
              {user?.role === 'admin' && (
                <button 
                  className="btn btn-primary ml-auto"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create New Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 All Tasks ({filteredTasks.length})</h3>
          </div>
          <div className="card-body">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No tasks found.</p>
                <p className="text-gray-400">Tasks will appear here once they are created.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Points</th>
                      <th>Difficulty</th>
                      <th>Status</th>
                      <th>Created</th>
                      {user?.role === 'admin' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task, index) => (
                      <tr key={task._id || `task-${index}`}>
                        <td className="font-semibold">{task.title || 'Untitled Task'}</td>
                        <td className="max-w-xs truncate">{task.description || 'No description'}</td>
                        <td>
                          <span className="badge badge-primary">{task.points || 0} pts</span>
                        </td>
                        <td>
                          <span className={`badge ${
                            task.difficulty === 'easy' ? 'badge-success' :
                            task.difficulty === 'medium' ? 'badge-warning' :
                            task.difficulty === 'hard' ? 'badge-danger' : 'badge-secondary'
                          }`}>
                            {task.difficulty || 'N/A'}
                          </span>
                        </td>
                        <td>
                          {user?.role === 'student' ? (
                            <div className="flex items-center gap-2">
                              {getStatusBadge(getTaskStatus(task))}
                              {getTaskStatus(task) === 'not-started' && (
                                <button 
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleSubmitTask(task)}
                                >
                                  Submit
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className={`badge ${task.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                              {task.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</td>
                        {user?.role === 'admin' && (
                          <td>
                            <div className="flex gap-2">
                              <button className="btn btn-secondary btn-sm">
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="btn btn-danger btn-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create New Task</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateTask}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      required
                    >
                      <option value="recycling">Recycling</option>
                      <option value="energy">Energy</option>
                      <option value="water">Water</option>
                      <option value="biodiversity">Biodiversity</option>
                      <option value="climate">Climate</option>
                      <option value="waste">Waste</option>
                      <option value="transport">Transport</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Points</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newTask.points}
                      onChange={(e) => setNewTask({...newTask, points: parseInt(e.target.value)})}
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      className="form-control"
                      value={newTask.difficulty}
                      onChange={(e) => setNewTask({...newTask, difficulty: e.target.value})}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Submission Modal */}
        {showSubmissionModal && selectedTask && (
          <div className="modal-overlay" onClick={() => setShowSubmissionModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Submit Task: {selectedTask.title}</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowSubmissionModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmissionSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Task Description</label>
                    <p className="text-gray-600">{selectedTask.description}</p>
                  </div>
                  <div className="form-group">
                    <label>Your Submission Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe what you did to complete this task..."
                      value={submissionData.description}
                      onChange={(e) => setSubmissionData({...submissionData, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Upload File (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => setSubmissionData({...submissionData, file: e.target.files[0]})}
                    />
                    <small className="text-gray-500">Upload photos, documents, or other proof of completion</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowSubmissionModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
