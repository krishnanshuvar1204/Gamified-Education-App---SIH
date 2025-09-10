const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student'
  },
  points: {
    type: Number,
    default: 0
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// XP Level System
const XP_LEVELS = [
  { level: 1, minXP: 0, maxXP: 50, rank: "🌱 Seedling", color: "#90EE90" },
  { level: 2, minXP: 50, maxXP: 100, rank: "🌿 Sprout", color: "#32CD32" },
  { level: 3, minXP: 100, maxXP: 200, rank: "🌳 Sapling", color: "#228B22" },
  { level: 4, minXP: 200, maxXP: 350, rank: "🌲 Tree", color: "#006400" },
  { level: 5, minXP: 350, maxXP: 550, rank: "🏞️ Forest Guardian", color: "#8B4513" },
  { level: 6, minXP: 550, maxXP: 800, rank: "🌍 Eco Warrior", color: "#4169E1" },
  { level: 7, minXP: 800, maxXP: 1200, rank: "🌟 Planet Protector", color: "#FFD700" }
];

// Calculate level info from XP
userSchema.methods.getLevelInfo = function() {
  const xp = this.xp || 0;
  
  // Find current level
  let currentLevelData = XP_LEVELS[0];
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXP) {
      currentLevelData = XP_LEVELS[i];
      break;
    }
  }
  
  // Calculate progress in current level
  const currentLevelXP = xp - currentLevelData.minXP;
  const nextLevelXP = currentLevelData.maxXP - currentLevelData.minXP;
  const progressPercent = Math.round((currentLevelXP / nextLevelXP) * 100);
  
  // Next level info
  const nextLevelData = XP_LEVELS.find(l => l.level === currentLevelData.level + 1);
  const xpToNextLevel = nextLevelData ? (nextLevelData.minXP - xp) : 0;
  
  return {
    currentLevel: currentLevelData.level,
    currentRank: currentLevelData.rank,
    currentLevelColor: currentLevelData.color,
    currentLevelXP: currentLevelXP,
    nextLevelXP: nextLevelXP,
    progressPercent: progressPercent,
    xpToNextLevel: xpToNextLevel,
    nextRank: nextLevelData ? nextLevelData.rank : "Max Level",
    totalXP: xp
  };
};

// Update level when XP changes
userSchema.pre('save', function(next) {
  if (this.isModified('xp')) {
    const levelInfo = this.getLevelInfo();
    this.level = levelInfo.currentLevel;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

