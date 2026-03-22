import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';

const serviceMock = {
  addStudent: jest.fn(),
  findStudent: jest.fn(),
  deleteStudent: jest.fn(),
  updateStudent: jest.fn(),
  addScore: jest.fn(),
  findByName: jest.fn(),
  countByNames: jest.fn(),
  findByMinScore: jest.fn(),
};

await jest.unstable_mockModule('../service/studentService.js', () => serviceMock);


const studentRouter = (await import('../routes/studentRoutes.js')).default;

const app = express();
app.use(express.json());
app.use(studentRouter);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('studentController integration', () => {
  describe('POST /student', () => {
    test('returns 204 when student is created', async () => {
      serviceMock.addStudent.mockResolvedValue(true);

      await request(app)
        .post('/student')
        .send({ id: 1, name: 'John', password: 'pass123' })
        .expect(204);

      expect(serviceMock.addStudent).toHaveBeenCalledWith({
        id: 1,
        name: 'John',
        password: 'pass123',
      });
    });

    test('returns 409 when student already exists', async () => {
      serviceMock.addStudent.mockResolvedValue(false);

      await request(app)
        .post('/student')
        .send({ id: 1, name: 'John', password: 'pass123' })
        .expect(409);

      expect(serviceMock.addStudent).toHaveBeenCalledTimes(1);
    });

    test('returns 400 for invalid body', async () => {
      const response = await request(app)
        .post('/student')
        .send({ name: 'John' })
        .expect(400);

      expect(response.text).toBeTruthy();
      expect(serviceMock.addStudent).not.toHaveBeenCalled();
    });
  });

  describe('GET /student/:id', () => {
    test('returns student by id', async () => {
      const student = { _id: 1, name: 'John' };
      serviceMock.findStudent.mockResolvedValue(student);

      const response = await request(app).get('/student/1').expect(200);

      expect(response.body).toEqual(student);
      expect(serviceMock.findStudent).toHaveBeenCalledWith(1);
    });

    test('returns 404 when student not found', async () => {
      serviceMock.findStudent.mockResolvedValue(null);

      await request(app).get('/student/1').expect(404);
    });
  });

  describe('DELETE /student/:id', () => {
    test('returns deleted student', async () => {
      const student = { _id: 1, name: 'John' };
      serviceMock.deleteStudent.mockResolvedValue(student);

      const response = await request(app).delete('/student/1').expect(200);

      expect(response.body).toEqual(student);
      expect(serviceMock.deleteStudent).toHaveBeenCalledWith(1);
    });

    test('returns 404 when student not found', async () => {
      serviceMock.deleteStudent.mockResolvedValue(null);

      await request(app).delete('/student/1').expect(404);
    });
  });

  describe('PATCH /student/:id', () => {
    test('returns updated student', async () => {
      const student = { _id: 1, name: 'Jane' };
      serviceMock.updateStudent.mockResolvedValue(student);

      const response = await request(app)
        .patch('/student/1')
        .send({ name: 'Jane' })
        .expect(200);

      expect(response.body).toEqual(student);
      expect(serviceMock.updateStudent).toHaveBeenCalledWith(1, { name: 'Jane' });
    });

    test('returns updated student when body is empty', async () => {
      const student = { _id: 1, name: 'Jane' };
      serviceMock.updateStudent.mockResolvedValue(student);

      const response = await request(app)
        .patch('/student/1')
        .send({})
        .expect(200);

      expect(response.body).toEqual(student);
      expect(serviceMock.updateStudent).toHaveBeenCalledWith(1, {});
    });

    test('returns 404 when student not found', async () => {
      serviceMock.updateStudent.mockResolvedValue(null);

      await request(app)
        .patch('/student/1')
        .send({ name: 'Jane' })
        .expect(404);
    });
  });

  describe('PATCH /score/student/:id', () => {
    test('returns 204 when score is added', async () => {
      serviceMock.addScore.mockResolvedValue(true);

      await request(app)
        .patch('/score/student/1')
        .send({ examName: 'math', score: 10 })
        .expect(204);

      expect(serviceMock.addScore).toHaveBeenCalledWith(1, 'math', 10);
    });

    test('returns 404 when student not found', async () => {
      serviceMock.addScore.mockResolvedValue(false);

      const response = await request(app)
        .patch('/score/student/1')
        .send({ examName: 'math', score: 10 })
        .expect(404);

      expect(response.body).toMatchObject({
        status: 404,
        error: 'Not Found',
        message: 'student not found',
        path: '/score/student/1',
      });
    });

    test('returns 400 for invalid score body', async () => {
      const response = await request(app)
        .patch('/score/student/1')
        .send({ score: 10 })
        .expect(400);

      expect(response.text).toBeTruthy();
      expect(serviceMock.addScore).not.toHaveBeenCalled();
    });
  });

  describe('GET /students/name/:name', () => {
    test('returns students by name', async () => {
      const students = [{ _id: 1, name: 'John' }];
      serviceMock.findByName.mockResolvedValue(students);

      const response = await request(app).get('/students/name/John').expect(200);

      expect(response.body).toEqual(students);
      expect(serviceMock.findByName).toHaveBeenCalledWith('John');
    });
  });

  describe('GET /quantity/students', () => {
    test('returns count for single name', async () => {
      serviceMock.countByNames.mockResolvedValue(2);

      const response = await request(app)
        .get('/quantity/students?names=John')
        .expect(200);

      expect(response.text).toBe('2');
      expect(serviceMock.countByNames).toHaveBeenCalledWith(['John']);
    });

    test('returns count for array of names', async () => {
      serviceMock.countByNames.mockResolvedValue(5);

      const response = await request(app)
        .get('/quantity/students?names=John&names=Jane')
        .expect(200);

      expect(response.text).toBe('5');
      expect(serviceMock.countByNames).toHaveBeenCalledWith(['John', 'Jane']);
    });
  });

  describe('GET /students/exam/:exam/minscore/:minScore', () => {
    test('returns students by minimum score', async () => {
      const students = [{ _id: 1, name: 'John' }];
      serviceMock.findByMinScore.mockResolvedValue(students);

      const response = await request(app)
        .get('/students/exam/math/minscore/50')
        .expect(200);

      expect(response.body).toEqual(students);
      expect(serviceMock.findByMinScore).toHaveBeenCalledWith('math', 50);
    });
  });
});