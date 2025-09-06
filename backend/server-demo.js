const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock data for demo
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@nexora.com',
    role: 'admin',
    points: 0,
    badges: []
  },
  {
    id: '2',
    name: 'Teacher One',
    email: 'teacher1@nexora.com',
    role: 'teacher',
    points: 0,
    badges: []
  },
  {
    id: '3',
    name: 'Student One',
    email: 'student1@nexora.com',
    role: 'student',
    points: 150,
    badges: [
      { name: 'Eco Warrior', description: 'Completed 5 environmental tasks' },
      { name: 'Quiz Master', description: 'Scored 90% or higher on 3 quizzes' }
    ]
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Recycle Plastic Bottles',
    description: 'Collect and properly recycle 10 plastic bottles. Take a photo of the bottles before recycling and document the recycling process.',
    category: 'recycling',
    points: 20,
    difficulty: 'easy',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'Teacher One', email: 'teacher1@nexora.com' },
    assignedTo: [{ name: 'Student One', email: 'student1@nexora.com' }],
    submissions: [
      {
        id: 'sub1',
        student: { name: 'Student One', email: 'student1@nexora.com' },
        description: 'Collected 12 plastic bottles from my neighborhood and took them to the local recycling center.',
        status: 'approved',
        pointsAwarded: 20,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: '2',
    title: 'Energy Conservation Challenge',
    description: 'Reduce your household energy consumption by 20% for one week. Track your daily usage and implement energy-saving measures.',
    category: 'energy',
    points: 50,
    difficulty: 'medium',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'Admin User', email: 'admin@nexora.com' },
    assignedTo: [{ name: 'Student One', email: 'student1@nexora.com' }],
    submissions: [
      {
        id: 'sub2',
        student: { name: 'Student One', email: 'student1@nexora.com' },
        description: 'I have been tracking my energy usage for the past week and implemented several energy-saving measures including switching to LED bulbs and unplugging devices when not in use.',
        status: 'pending',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  }
];

const mockQuizzes = [
  {
    id: '1',
    title: 'Climate Change Basics',
    description: 'Test your knowledge about climate change and its impacts on our planet.',
    category: 'climate',
    points: 25,
    timeLimit: 15,
    createdBy: { name: 'Teacher One', email: 'teacher1@nexora.com' },
    questions: [
      {
        question: 'What is the primary cause of global warming?',
        options: ['Solar radiation', 'Greenhouse gases', 'Ocean currents', 'Volcanic activity'],
        correctAnswer: 1,
        explanation: 'Greenhouse gases trap heat in the atmosphere, causing global warming.'
      },
      {
        question: 'Which gas is the most significant contributor to the greenhouse effect?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'],
        correctAnswer: 2,
        explanation: 'Carbon dioxide is the most significant greenhouse gas contributing to climate change.'
      }
    ]
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Nexora API is running (Demo Mode)',
    timestamp: new Date().toISOString(),
    mode: 'demo'
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password - either stored password or default demo passwords
  const validPassword = user.password === password || 
                       (password === 'admin123' && user.role === 'admin') ||
                       (password === 'teacher123' && user.role === 'teacher') ||
                       (password === 'student123' && user.role === 'student');

  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token: 'demo-token-' + user.id,
      user: user
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  const newUser = {
    id: (mockUsers.length + 1).toString(),
    name,
    email,
    password, // Store the password for login
    role,
    points: 0,
    badges: []
  };

  mockUsers.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      token: 'demo-token-' + newUser.id,
      user: newUser
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  const userId = token.replace('demo-token-', '');
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
});

// Users routes
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: mockUsers.length,
    data: mockUsers
  });
});

app.get('/api/users/students', (req, res) => {
  const students = mockUsers.filter(u => u.role === 'student');
  res.json({
    success: true,
    count: students.length,
    data: students
  });
});

app.get('/api/users/leaderboard', (req, res) => {
  const students = mockUsers
    .filter(u => u.role === 'student')
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);
  
  res.json({
    success: true,
    data: students
  });
});

// Tasks routes
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    count: mockTasks.length,
    data: mockTasks
  });
});

app.get('/api/tasks/my-tasks', (req, res) => {
  res.json({
    success: true,
    count: mockTasks.length,
    data: mockTasks
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, category, points, difficulty, dueDate } = req.body;
  
  const newTask = {
    id: (mockTasks.length + 1).toString(),
    title,
    description,
    category,
    points: parseInt(points),
    difficulty: difficulty || 'easy',
    dueDate,
    createdAt: new Date().toISOString(),
    createdBy: 'demo-user',
    submissions: []
  };
  
  mockTasks.push(newTask);
  
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = mockTasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  mockTasks.splice(taskIndex, 1);
  
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

app.post('/api/tasks/submit', (req, res) => {
  const { taskId, description } = req.body;
  
  const task = mockTasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  // Add submission to task
  if (!task.submissions) {
    task.submissions = [];
  }
  
  const submission = {
    id: Date.now().toString(),
    student: '3', // Demo student ID
    description,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  
  task.submissions.push(submission);
  
  res.status(201).json({
    success: true,
    message: 'Task submitted successfully',
    data: submission
  });
});

// Quizzes routes
app.get('/api/quizzes', (req, res) => {
  res.json({
    success: true,
    count: mockQuizzes.length,
    data: mockQuizzes
  });
});

app.get('/api/quizzes/my-quizzes', (req, res) => {
  res.json({
    success: true,
    count: mockQuizzes.length,
    data: mockQuizzes
  });
});

app.post('/api/quizzes', (req, res) => {
  const { title, description, category, points, timeLimit, questions } = req.body;
  
  const newQuiz = {
    id: (mockQuizzes.length + 1).toString(),
    title,
    description,
    category,
    points: parseInt(points),
    timeLimit: parseInt(timeLimit),
    questions,
    createdAt: new Date().toISOString(),
    createdBy: 'demo-user',
    attempts: []
  };
  
  mockQuizzes.push(newQuiz);
  
  res.status(201).json({
    success: true,
    message: 'Quiz created successfully',
    data: newQuiz
  });
});

app.delete('/api/quizzes/:id', (req, res) => {
  const quizIndex = mockQuizzes.findIndex(q => q.id === req.params.id);
  if (quizIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }
  
  mockQuizzes.splice(quizIndex, 1);
  
  res.json({
    success: true,
    message: 'Quiz deleted successfully'
  });
});

app.post('/api/quizzes/submit', (req, res) => {
  const { quizId, answers, timeTaken, studentId } = req.body;
  
  const quiz = mockQuizzes.find(q => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: 'Quiz not found'
    });
  }
  
  // Check if student has already attempted this quiz
  if (!quiz.attempts) {
    quiz.attempts = [];
  }
  
  const existingAttempt = quiz.attempts.find(attempt => attempt.student === studentId);
  if (existingAttempt) {
    return res.status(400).json({
      success: false,
      message: 'You have already completed this quiz'
    });
  }
  
  // Calculate score
  let correctAnswers = 0;
  if (quiz.questions && answers) {
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
  }
  
  const score = quiz.questions ? Math.round((correctAnswers / quiz.questions.length) * 100) : 0;
  const pointsEarned = Math.round((score / 100) * quiz.points);
  
  const attempt = {
    id: Date.now().toString(),
    student: studentId, // Use actual student ID
    answers,
    score,
    correctAnswers,
    totalQuestions: quiz.questions ? quiz.questions.length : 0,
    pointsEarned,
    timeTaken,
    completedAt: new Date().toISOString()
  };
  
  quiz.attempts.push(attempt);
  
  // Update correct student points
  const student = mockUsers.find(u => u.id === studentId);
  if (student) {
    student.points = (student.points || 0) + pointsEarned;
  }
  
  res.status(201).json({
    success: true,
    message: 'Quiz submitted successfully',
    data: attempt
  });
});

// Task review route for teachers
app.put('/api/tasks/:id/review', (req, res) => {
  const { submissionId, status, feedback, pointsAwarded } = req.body;
  const taskId = req.params.id;
  
  const task = mockTasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const submission = task.submissions.find(s => s.id === submissionId);
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: 'Submission not found'
    });
  }
  
  // Update submission
  submission.status = status;
  submission.feedback = feedback;
  submission.pointsAwarded = pointsAwarded || 0;
  submission.reviewedAt = new Date().toISOString();
  
  // Update student points if approved
  if (status === 'approved' && pointsAwarded > 0) {
    const student = mockUsers.find(u => u.id === '3');
    if (student) {
      student.points = (student.points || 0) + pointsAwarded;
    }
  }
  
  res.json({
    success: true,
    message: 'Submission reviewed successfully',
    data: submission
  });
});

// User creation route
app.post('/api/users', (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }
  
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    name,
    email,
    password: password || 'password123', // Store password for login
    role,
    points: 0,
    badges: [],
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Nexora Demo Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`📊 Demo mode - using mock data`);
  console.log(`\n🔑 Demo Accounts:`);
  console.log(`Admin: admin@nexora.com / admin123`);
  console.log(`Teacher: teacher1@nexora.com / teacher123`);
  console.log(`Student: student1@nexora.com / student123`);
});

