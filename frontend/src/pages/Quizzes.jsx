import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const Quizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ 
    title: '', 
    description: '', 
    category: 'recycling', 
    points: 25, 
    timeLimit: 10, 
    questions: [{ question: '', options: ['', ''], correctAnswer: 0, explanation: '' }] 
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating quiz with data:', newQuiz);
      const response = await axios.post('/api/quizzes', newQuiz);
      console.log('Quiz created successfully:', response.data);
      setShowCreateModal(false);
      setNewQuiz({ 
        title: '', 
        description: '', 
        category: 'recycling', 
        points: 25, 
        timeLimit: 10, 
        questions: [{ question: '', options: ['', ''], correctAnswer: 0, explanation: '' }] 
      });
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      console.error('Error creating quiz:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Error creating quiz. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`/api/quizzes/${quizId}`);
        fetchQuizzes(); // Refresh the list
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleTakeQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizAnswers({});
    setQuizStartTime(new Date());
    setShowQuizModal(true);
  };

  const handleQuizSubmit = async () => {
    try {
      console.log('Submitting quiz:', {
        quizId: selectedQuiz.id,
        answers: quizAnswers,
        timeTaken: Math.floor((Date.now() - quizStartTime) / 1000),
        studentId: user.id
      });

      const response = await axios.post('/api/quizzes/submit', {
        quizId: selectedQuiz.id,
        answers: quizAnswers,
        timeTaken: Math.floor((Date.now() - quizStartTime) / 1000),
        studentId: user.id
      });

      console.log('Quiz submission response:', response.data);
      
      if (response.data.success) {
        alert(`Quiz completed! Score: ${response.data.data.score}% | Points earned: ${response.data.data.pointsEarned}`);
        setShowQuizModal(false);
        setQuizAnswers({});
        setQuizStartTime(null);
        fetchQuizzes(); // Refresh the list
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Error submitting quiz. Please try again.';
      alert(errorMessage);
    }
  };

  const getQuizStatus = (quiz) => {
    if (!user || !quiz.attempts) return 'not-attempted';
    const userAttempt = quiz.attempts.find(attempt => attempt.student === user.id);
    return userAttempt ? 'completed' : 'not-attempted';
  };

  const hasUserCompletedQuiz = (quiz) => {
    if (!user || !quiz.attempts) return false;
    return quiz.attempts.some(attempt => attempt.student === user.id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      default:
        return <span className="badge badge-info">Not Attempted</span>;
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    if (filter === 'active') return quiz.isActive !== false;
    if (filter === 'inactive') return quiz.isActive === false;
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
          <h1 className="dashboard-title">Quizzes Management</h1>
          <p className="dashboard-subtitle">
            Manage all environmental education quizzes
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
                <option value="all">All Quizzes</option>
                <option value="active">Active Quizzes</option>
                <option value="inactive">Inactive Quizzes</option>
              </select>
              {user?.role === 'admin' && (
                <button 
                  className="btn btn-primary ml-auto"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create New Quiz
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quizzes List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🧠 All Quizzes ({filteredQuizzes.length})</h3>
          </div>
          <div className="card-body">
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No quizzes found.</p>
                <p className="text-gray-400">Quizzes will appear here once they are created.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Questions</th>
                      <th>Points</th>
                      <th>Difficulty</th>
                      <th>Status</th>
                      <th>Created</th>
                      {user?.role === 'admin' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuizzes.map((quiz, index) => (
                      <tr key={quiz._id || `quiz-${index}`}>
                        <td className="font-semibold">{quiz.title || 'Untitled Quiz'}</td>
                        <td className="max-w-xs truncate">{quiz.description || 'No description'}</td>
                        <td>
                          <span className="badge badge-info">
                            {quiz.questions?.length || 0} questions
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-primary">{quiz.points || 0} pts</span>
                        </td>
                        <td>
                          <span className={`badge ${
                            quiz.difficulty === 'easy' ? 'badge-success' :
                            quiz.difficulty === 'medium' ? 'badge-warning' :
                            quiz.difficulty === 'hard' ? 'badge-danger' : 'badge-secondary'
                          }`}>
                            {quiz.difficulty || 'N/A'}
                          </span>
                        </td>
                        <td>
                          {user?.role === 'student' ? (
                            <div className="flex items-center gap-2">
                              {getStatusBadge(getQuizStatus(quiz))}
                              {hasUserCompletedQuiz(quiz) ? (
                                <button 
                                  className="btn btn-secondary btn-sm"
                                  disabled
                                >
                                  Completed
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleTakeQuiz(quiz)}
                                >
                                  Take Quiz
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className={`badge ${quiz.isActive !== false ? 'badge-success' : 'badge-danger'}`}>
                              {quiz.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td>{quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'N/A'}</td>
                        {user?.role === 'admin' && (
                          <td>
                            <div className="flex gap-2">
                              <button className="btn btn-secondary btn-sm">
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz._id)}
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

        {/* Create Quiz Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create New Quiz</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateQuiz}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={newQuiz.category}
                      onChange={(e) => setNewQuiz({...newQuiz, category: e.target.value})}
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
                      value={newQuiz.points}
                      onChange={(e) => setNewQuiz({...newQuiz, points: parseInt(e.target.value)})}
                      min="1"
                      max="50"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time Limit (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newQuiz.timeLimit}
                      onChange={(e) => setNewQuiz({...newQuiz, timeLimit: parseInt(e.target.value)})}
                      min="1"
                      max="60"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Question</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newQuiz.questions[0].question}
                      onChange={(e) => {
                        const updatedQuestions = [...newQuiz.questions];
                        updatedQuestions[0].question = e.target.value;
                        setNewQuiz({...newQuiz, questions: updatedQuestions});
                      }}
                      placeholder="Enter your question here..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Option 1</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newQuiz.questions[0].options[0]}
                      onChange={(e) => {
                        const updatedQuestions = [...newQuiz.questions];
                        updatedQuestions[0].options[0] = e.target.value;
                        setNewQuiz({...newQuiz, questions: updatedQuestions});
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Option 2</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newQuiz.questions[0].options[1]}
                      onChange={(e) => {
                        const updatedQuestions = [...newQuiz.questions];
                        updatedQuestions[0].options[1] = e.target.value;
                        setNewQuiz({...newQuiz, questions: updatedQuestions});
                      }}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Correct Answer</label>
                    <select
                      className="form-control"
                      value={newQuiz.questions[0].correctAnswer}
                      onChange={(e) => {
                        const updatedQuestions = [...newQuiz.questions];
                        updatedQuestions[0].correctAnswer = parseInt(e.target.value);
                        setNewQuiz({...newQuiz, questions: updatedQuestions});
                      }}
                      required
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                    </select>
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
                    Create Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quiz Taking Modal */}
        {showQuizModal && selectedQuiz && (
          <div className="modal-overlay" onClick={() => setShowQuizModal(false)}>
            <div className="modal-content quiz-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Quiz: {selectedQuiz.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Time Limit: {selectedQuiz.timeLimit} minutes
                  </span>
                  <button 
                    className="modal-close"
                    onClick={() => setShowQuizModal(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <p className="text-gray-600 mb-4">{selectedQuiz.description}</p>
                
                {selectedQuiz.questions && selectedQuiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="form-group">
                    <label className="font-semibold">
                      Question {qIndex + 1}: {question.question}
                    </label>
                    <div className="mt-2 space-y-2">
                      {question.options && question.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            checked={quizAnswers[qIndex] === oIndex}
                            onChange={(e) => setQuizAnswers({
                              ...quizAnswers,
                              [qIndex]: parseInt(e.target.value)
                            })}
                            className="mr-2"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowQuizModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={handleQuizSubmit}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
