const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/students
// @desc    Get all students
// @access  Private (Teacher, Admin)
router.get('/students', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isActive: true })
      .select('-password')
      .sort({ points: -1 });

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'student', isActive: true })
      .select('name points badges')
      .sort({ points: -1 })
      .limit(10);

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put('/:id/role', protect, authorize('admin'), [
  body('role').isIn(['admin', 'teacher', 'student']).withMessage('Role must be admin, teacher, or student')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { role } = req.body;
    const userId = req.params.id;

    // Prevent admin from changing their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/:id/deactivate
// @desc    Deactivate user (admin only)
// @access  Private (Admin)
router.put('/:id/deactivate', protect, authorize('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deactivating themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/:id/points
// @desc    Update user points (admin/teacher only)
// @access  Private (Admin, Teacher)
router.put('/:id/points', protect, authorize('admin', 'teacher'), [
  body('points').isInt({ min: 0 }).withMessage('Points must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { points } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { points },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User points updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

