import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import { useXPUpdates } from '../hooks/useXPUpdates';

const Resources = () => {
  const { user } = useAuth();
  const { handleResourceCompletion } = useXPUpdates();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    category: 'environmental-science',
    quiz: {
      questions: [
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    }
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/resources');
      setResources(response.data.data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/resources', newResource);
      setShowCreateModal(false);
      setNewResource({
        title: '',
        description: '',
        url: '',
        category: 'environmental-science',
        quiz: {
          questions: [
            { question: '', options: ['', '', '', ''], correctAnswer: 0 }
          ]
        }
      });
      fetchResources();
      alert('Resource created successfully!');
    } catch (error) {
      console.error('Error creating resource:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Error creating resource. Please try again.';
      alert(errorMessage);
    }
  };

  const handleTakeQuiz = (resource) => {
    setSelectedResource(resource);
    setQuizAnswers({});
    setQuizStartTime(new Date());
    setShowQuizModal(true);
  };

  const handleQuizSubmit = async () => {
    try {
      const response = await axios.post('/api/resources/quiz-attempt', {
        resourceId: selectedResource.id,
        answers: quizAnswers,
        timeTaken: Math.floor((Date.now() - quizStartTime) / 1000),
        studentId: user.id
      });
      if (response.data.success) {
        const score = response.data.data.score;
        const pointsEarned = response.data.data.pointsEarned || 0;
        
        if (score === 100) {
          alert(`Perfect! You scored ${score}% and completed this resource! +${pointsEarned} XP earned!`);
          setShowQuizModal(false);
          fetchResources();
          // Trigger XP update and animations
          await handleResourceCompletion();
        } else {
          alert(`You scored ${score}%. You need 100% to complete this resource. Please try again!`);
          setQuizStartTime(new Date());
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  const addQuestion = () => {
    setNewResource({
      ...newResource,
      quiz: {
        ...newResource.quiz,
        questions: [
          ...newResource.quiz.questions,
          { question: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]
      }
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...newResource.quiz.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setNewResource({
      ...newResource,
      quiz: {
        ...newResource.quiz,
        questions: updatedQuestions
      }
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newResource.quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setNewResource({
      ...newResource,
      quiz: {
        ...newResource.quiz,
        questions: updatedQuestions
      }
    });
  };

  const getResourceStatus = (resource) => {
    if (!user || !resource.completedBy) return 'not-completed';
    return resource.completedBy.includes(user.id) ? 'completed' : 'not-completed';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">✓ Completed</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
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
          <h1 className="dashboard-title">📚 Learning Resources</h1>
          <p className="dashboard-subtitle">
            {user?.role === 'teacher' || user?.role === 'admin' 
              ? 'Create and manage educational resources with quizzes'
              : 'Study resources and complete quizzes to earn points'
            }
          </p>
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              + Add Resource
            </button>
          )}
        </div>

        {/* Resources List */}
        <div className="grid grid-1">
          {resources.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-8">
                <p className="text-gray-500 text-lg">No resources available yet.</p>
                {(user?.role === 'teacher' || user?.role === 'admin') && (
                  <p className="text-gray-400">Create your first resource to get started!</p>
                )}
              </div>
            </div>
          ) : (
            resources.map((resource) => {
              const status = getResourceStatus(resource);
              return (
                <div key={resource.id} className="card">
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                        <p className="text-gray-600 mb-3">{resource.description}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="badge badge-info">{resource.category}</span>
                          {getStatusBadge(status)}
                        </div>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          📖 Study Resource
                        </a>
                      </div>
                      <div className="flex flex-col gap-2">
                        {user?.role === 'student' && (
                          <>
                            {status === 'completed' ? (
                              <span className="text-green-600 font-semibold">✅ Completed</span>
                            ) : (
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleTakeQuiz(resource)}
                              >
                                📝 Take Quiz
                              </button>
                            )}
                          </>
                        )}
                        {(user?.role === 'teacher' || user?.role === 'admin') && (
                          <div className="text-sm text-gray-500">
                            {resource.completedBy ? resource.completedBy.length : 0} students completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create Resource Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create New Resource</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateResource}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newResource.title}
                      onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newResource.description}
                      onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Resource URL *</label>
                    <input
                      type="url"
                      className="form-control"
                      value={newResource.url}
                      onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                      placeholder="https://example.com/resource"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={newResource.category}
                      onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                    >
                      <option value="environmental-science">Environmental Science</option>
                      <option value="climate-change">Climate Change</option>
                      <option value="renewable-energy">Renewable Energy</option>
                      <option value="conservation">Conservation</option>
                      <option value="sustainability">Sustainability</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quiz Questions</label>
                    {newResource.quiz.questions.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded p-4 mb-4">
                        <div className="form-group">
                          <label>Question {qIndex + 1}</label>
                          <input
                            type="text"
                            className="form-control"
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            placeholder="Enter your question"
                            required
                          />
                        </div>
                        
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="form-group">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={question.correctAnswer === oIndex}
                                onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                              />
                              Option {oIndex + 1} {question.correctAnswer === oIndex && '(Correct)'}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={addQuestion}
                    >
                      + Add Question
                    </button>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quiz Modal */}
        {showQuizModal && selectedResource && (
          <div className="modal-overlay" onClick={() => setShowQuizModal(false)}>
            <div className="modal-content quiz-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Quiz: {selectedResource.title}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-red-600 font-semibold">
                    ⚠️ You must score 100% to complete this resource
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
                <p className="text-gray-600 mb-4">{selectedResource.description}</p>
                
                {selectedResource.quiz && selectedResource.quiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="form-group">
                    <label className="font-semibold">
                      Question {qIndex + 1}: {question.question}
                    </label>
                    <div className="space-y-2 mt-2">
                      {question.options.map((option, oIndex) => (
                        <label key={oIndex} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            checked={quizAnswers[qIndex] === oIndex}
                            onChange={(e) => setQuizAnswers({
                              ...quizAnswers,
                              [qIndex]: parseInt(e.target.value)
                            })}
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
                  disabled={Object.keys(quizAnswers).length !== selectedResource.quiz?.questions?.length}
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

export default Resources;
