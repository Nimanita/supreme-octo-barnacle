const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../src/server');
const Employee = require('../src/models/employee');
const Task = require('../src/models/task');
const redis = require('../src/config/redis');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  if (redis.status !== 'ready') {
    await new Promise((resolve) => redis.on('ready', resolve));
  }
}, 30000);

afterEach(async () => {
  await Employee.deleteMany({});
  await Task.deleteMany({});
  try {
    if (redis.status === 'ready') await redis.flushall();
  } catch (e) {}
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (redis.status === 'ready') await redis.disconnect();
}, 30000);

describe('Backend Acceptance Tests', () => {
  
  // ✅ 1. APIs return meta for pagination
  test('Employee API returns pagination meta', async () => {
    await Employee.create([
      { name: 'Alice', email: 'alice@test.com', role: 'Dev' },
      { name: 'Bob', email: 'bob@test.com', role: 'Designer' }
    ]);

    const res = await request(app).get('/api/employees?page=1&limit=1').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 1,
      totalItems: 2,
      totalPages: 2
    });
  });

  test('Task API returns pagination meta', async () => {
    await Task.create([
      { title: 'Task 1', status: 'todo', priority: 'high' },
      { title: 'Task 2', status: 'completed', priority: 'low' }
    ]);

    const res = await request(app).get('/api/tasks?page=1&limit=1').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 1,
      totalItems: 2,
      totalPages: 2
    });
  });

  // ✅ 2. Validation errors follow unified shape
  test('Validation error has unified shape (code, message, details)', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ name: 'Test' }) // Missing email
      .expect(400);

    expect(res.body).toMatchObject({
      success: false,
      code: 'VALIDATION_ERROR',
      message: expect.any(String),
      details: expect.any(Array)
    });
    expect(res.body.details[0]).toHaveProperty('field');
    expect(res.body.details[0]).toHaveProperty('issue');
  });

  // ✅ 3. Dashboard includes overdue + average completion metrics
  test('Dashboard includes overdue tasks count', async () => {
    const yesterday = new Date(Date.now() - 86400000);
    await Task.create({ 
      title: 'Overdue Task', 
      status: 'todo', 
      priority: 'high', 
      dueDate: yesterday 
    });

    const res = await request(app).get('/api/dashboard').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.overdueTasks).toBe(1);
  });

  test('Dashboard includes average completion time', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    
    await Task.create({
      title: 'Completed Task',
      status: 'completed',
      priority: 'high',
      createdAt: yesterday,
      completedAt: now
    });

    const res = await request(app).get('/api/dashboard').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('avgCompletionTime');
    expect(res.body.data.avgCompletionTime).not.toBe('N/A');
  });

  // ✅ 4. Redis caching works and invalidates
  test('Dashboard metrics are cached and invalidated on create', async () => {
    // Prime cache
    await request(app).get('/api/dashboard').expect(200);
    
    const cached = await redis.get('dashboard:metrics');
    expect(cached).not.toBeNull();

    // Create task should invalidate cache
    await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task', status: 'todo', priority: 'high' })
      .expect(201);

    const cacheAfter = await redis.get('dashboard:metrics');
    expect(cacheAfter).toBeNull();
  });
});

