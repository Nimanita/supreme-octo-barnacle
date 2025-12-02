const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  role: {
    type: String,
    trim: true,
    maxlength: [50, 'Role cannot exceed 50 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for tasks
employeeSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'assignedTo'
});

// Index for faster queries
employeeSchema.index({ email: 1 });
employeeSchema.index({ name: 1 });

// Pre-remove hook to cascade delete tasks
employeeSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    await mongoose.model('Task').deleteMany({ assignedTo: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;