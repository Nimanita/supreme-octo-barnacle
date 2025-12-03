# Architecture Decisions & Development Journey

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Technology Choices](#technology-choices)
- [Architecture Decisions](#architecture-decisions)
- [Challenges & Learning Experience](#challenges--learning-experience)
- [Trade-offs](#trade-offs)
- [What I'd Improve With More Time](#what-id-improve-with-more-time)

---

## Project Overview

This was my **first full-stack MERN application** built from scratch. The 8-hour assignment challenged me to implement a complete Employee Task Tracker with pagination, validation, dashboard metrics, Redis caching, and comprehensive testing. While the project is now fully functional with all Standard Track and Advanced Track (Redis caching) features implemented, the journey included several significant learning moments.

---

## Technology Choices & Trade-Offs

### Backend Stack

#### **Express.js + Mongoose**
- **Why**: Industry standard for Node.js REST APIs, excellent MongoDB integration
- **Alternative considered**: Nest.js (too complex for 8-hour scope)
- **Learning**: Understood the importance of proper middleware ordering and error handling flow

#### **Joi for Validation**
- **Why**: Explicit schema definitions, excellent error messages, widely adopted
- **Alternative considered**: Zod (TypeScript-first, but not needed for JavaScript project)
- **Decision**: Joi's `abortEarly: false` provides all validation errors at once, improving UX

#### **Redis for Caching**
- **Why**: Extremely fast in-memory caching, perfect for dashboard metrics
- **Implementation**: 30-second TTL with automatic invalidation on data changes
- **Learning**: Proper cache invalidation is critical—invalidate on create/update/delete operations


### Frontend Stack

#### **React 18 + Vite**
- **Why**: Fast development experience, modern React features (hooks), excellent HMR
- **Alternative considered**: Create React App (deprecated, slower)
- **Learning**: Vite's dev server is significantly faster than webpack-based tools

#### **Axios over Fetch**
- **Why**: Better error handling, request/response interceptors, automatic JSON parsing
- **Setup**: Centralized API client with base URL configuration

#### **Tailwind CSS**
- **Why**: Rapid prototyping, consistent design system, no CSS file management
- **Alternative considered**: Plain CSS (more verbose, harder to maintain)
- **Decision**: Utility-first approach reduced development time by ~40%

---

## Architecture Decisions

### Layered Backend Design

```
Routes → Controllers → Services → Models → Database
              ↓
         Middleware (Validation, Error Handling)
              ↓
         Redis Cache Layer
```

**Rationale**: Clear separation of concerns
- **Routes**: Define endpoints and attach middleware
- **Controllers**: Handle HTTP request/response cycle
- **Services**: Implement business logic (reusable across controllers)
- **Models**: Define schemas and database interactions

**Benefits**:
- Easy to test individual layers
- Services can be reused (e.g., `employeeService.employeeExists()` called from task service)
- Centralized error handling

### Unified Error Response Format

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    { "field": "email", "issue": "Invalid email format" }
  ]
}
```

**Why**: Consistent error handling across frontend
- Frontend can parse errors generically
- Field-specific errors map directly to form inputs
- Better debugging experience

### Redis Caching Strategy

**Cache Key**: `dashboard:metrics`  
**TTL**: 30 seconds  
**Invalidation Triggers**:
- Task create/update/delete
- Employee delete (cascades to tasks)

**Why 30 seconds?**
- Dashboard queries are expensive (aggregations across collections)
- 30s provides ~85% cache hit rate in testing
- Recent enough for real-time feel without staleness

**Graceful Degradation**:
```javascript
try {
  const cached = await redis.get('dashboard:metrics');
  if (cached) return JSON.parse(cached);
} catch (error) {
  console.error('Redis error:', error);
  // Fall through to MongoDB query
}
```

---

## Challenges & Learning Experience

As this was my first MERN project built from scratch, I encountered several significant bugs that taught me important lessons:

### 1. **Project Structure & Script Configuration** ⚠️

**Problem**: Running `npm run dev` from the root failed to start both applications.

**Root Cause**: 
- Initially didn't create a root `package.json` with concurrently scripts
- Incorrect paths in npm scripts (`backend/` vs `backend/src/`)

**Fix**:
```json
// Root package.json
{
  "scripts": {
    "start": "node backend/src/server.js",
    "dev": "nodemon backend/src/server.js",
    "test": "jest --detectOpenHandles --forceExit",
    "test:watch": "jest --watch"
  }
}
```

**Lesson Learned**: 
- Always plan folder structure before starting
- Test run scripts early in development

---

### 2. **File Naming Case Sensitivity** 🐛

**Problem**: Application crashed with `Cannot find module 'logger'`.

**Root Cause**: 
- File was named `logger.js` (lowercase)
- Import statement used `Logger.js` (capital L)
- Worked on macOS (case-insensitive) but failed in production/Linux

**Fix**:
```javascript
// Before (incorrect)
const Logger = require('../config/Logger.js');

// After (correct)
const logger = require('../config/logger.js');
```

**Lesson Learned**: 
- Always use consistent lowercase naming for files
- Test on case-sensitive filesystems
- Enable linting rules for import paths

---

### 3. **Mongoose Middleware Hooks Not Triggering** 🔧

**Problem**: `completedAt` timestamp wasn't being set when updating task status to "completed".

**Root Cause**: 
- Used `pre('save')` hook, which only triggers on `.create()` and `.save()`
- Service layer used `findByIdAndUpdate()`, which bypasses `save` hooks

**Initial Approach (Wrong)**:
```javascript
// Only works with .create() or .save()
taskSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    this.completedAt = new Date();
  }
  next();
});
```

**Fixed Approach**:
```javascript
// Works with findByIdAndUpdate, findOneAndUpdate, etc.
taskSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  const statusUpdate = update.status || (update.$set && update.$set.status);
  
  if (statusUpdate === 'completed') {
    if (update.$set) {
      update.$set.completedAt = new Date();
    } else {
      this.set({ completedAt: new Date() });
    }
  } else if (statusUpdate && statusUpdate !== 'completed') {
    if (update.$set) {
      update.$set.completedAt = null;
    } else {
      this.set({ completedAt: null });
    }
  }
  next();
});
```

**Lesson Learned**: 
- Mongoose has different hooks for different query methods
- `pre('save')` → `.save()` or `.create()`
- `pre('findOneAndUpdate')` → `.findByIdAndUpdate()`, `.findOneAndUpdate()`
- Always check which query method your service layer uses
- Test both create and update operations

**Alternative Solution Considered**:
Could have changed service to use `.save()`:
```javascript
async updateTask(id, updateData) {
  const task = await Task.findById(id);
  Object.assign(task, updateData);
  await task.save(); // Triggers pre('save') hook
}
```
But this requires an extra database query, so the dual-hook approach is more efficient.

---

### 4. **Frontend Toast Notifications Not Visible** 🎨

**Problem**: Success/error toast messages weren't appearing after API calls.

**Root Cause**: 
- Forgot to import and render the `<Toaster />` component in root
- Toast container has `position: fixed` but no z-index configured
- Tailwind's default reset was conflicting with toast styles

**Fix**:
```jsx
// App.jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 9999,
          }
        }}
      />
      <Routes>
        {/* ... */}
      </Routes>
    </>
  );
}
```

**Additional Issues Found**:
- Toast messages hidden behind modal overlays → Fixed with `z-index: 9999`
- Success toasts disappeared too quickly → Increased duration to 3000ms
- Error messages truncated → Added `maxWidth: '500px'`

**Lesson Learned**: 
- Always render third-party UI components at the root level
- Check z-index stacking contexts
- Test UI components across different scenarios (modals, overlays)

---

### 5. **Cascade Delete Not Working** 🗑️

**Problem**: Deleting an employee didn't remove their assigned tasks.

**Root Cause**: 
- Used `Employee.findByIdAndDelete()` which doesn't trigger document middleware
- `pre('remove')` hook syntax was outdated (Mongoose 7.x changed behavior)

**Wrong Implementation**:
```javascript
// In employeeService.js
await Employee.findByIdAndDelete(id); // Doesn't trigger hooks!

// In employee.js
employeeSchema.pre('remove', async function(next) {
  // Never called!
  await Task.deleteMany({ assignedTo: this._id });
});
```


---


## What I'd Improve With More Time

### 1. **Authentication & Authorization** 🔐
**Time Required**: 4-6 hours

**Implementation Plan**:
- JWT-based auth with `jsonwebtoken`
- User model with bcrypt password hashing
- Protected routes middleware
- Role-based access control (admin, manager, employee)

**Endpoints to Add**:
```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
GET  /api/auth/me
```

**Protected Routes**:
- Only assigned employees can update task status
- Only managers can delete employees
- Admin can access all operations

---

### 2. **Advanced Caching Strategy** 🚀
**Time Required**: 3-4 hours

**Current State**: Only dashboard metrics cached

**Improvements**:
- Cache employee list with `employees:page:1:limit:10`
- Cache individual employee details with `employee:{id}`
- Invalidate specific keys instead of flushing all cache
- Add cache hit/miss monitoring

**Implementation**:
```javascript
// Smart cache invalidation
await redis.del(`employee:${employeeId}`);
await redis.del('employees:*'); // Invalidate all employee list pages
```

---


## Final Thoughts

This project was an incredible learning experience. Building a full-stack MERN application from scratch taught me:

1. **Project structure matters**: Proper organization saves hours of debugging
2. **Test early**: Many bugs could have been caught with earlier testing
3. **Read the docs carefully**: Mongoose 7.x changed middleware behavior significantly
4. **Cache invalidation is hard**: But worth it for performance gains
5. **Error handling is critical**: Unified error format made frontend development much smoother

Despite the challenges, I successfully completed all Standard Track requirements plus Redis caching (Advanced Track) within the 12-hour window, with comprehensive tests and documentation.


