import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const repoMock = {
  findStudentById: jest.fn(),
  createStudent: jest.fn(),
  deleteStudentById: jest.fn(),
  updateStudent: jest.fn(),
  updateScore: jest.fn(),
  findStudentsByName: jest.fn(),
  countStudentsByName: jest.fn(),
  findStudentsMinScore: jest.fn(),
};

await jest.unstable_mockModule('../repository/studentRepository.js', () => repoMock);


const studentService = await import('../service/studentService.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('addStudent', () => {
  test('returns false when student already exists', async () => {
    repoMock.findStudentById.mockResolvedValue({ _id: '1' });

    const result = await studentService.addStudent({
      id: '1',
      name: 'John',
      password: 'pass',
    });

    expect(result).toBe(false);
    expect(repoMock.findStudentById).toHaveBeenCalledWith('1');
    expect(repoMock.createStudent).not.toHaveBeenCalled();
  });

  test('returns true and creates student when student does not exist', async () => {
    repoMock.findStudentById.mockResolvedValue(null);

    const result = await studentService.addStudent({
      id: '1',
      name: 'John',
      password: 'pass',
    });

    expect(result).toBe(true);
    expect(repoMock.findStudentById).toHaveBeenCalledWith('1');
    expect(repoMock.createStudent).toHaveBeenCalledWith({
      _id: '1',
      name: 'John',
      password: 'pass',
    });
  });
});

describe('findStudent', () => {
  test('returns student by id', async () => {
    const student = { _id: '1', name: 'John' };
    repoMock.findStudentById.mockResolvedValue(student);

    await expect(studentService.findStudent('1')).resolves.toEqual(student);
    expect(repoMock.findStudentById).toHaveBeenCalledWith('1');
  });
});

describe('deleteStudent', () => {
  test('calls repository and returns result', async () => {
    repoMock.deleteStudentById.mockResolvedValue(true);

    await expect(studentService.deleteStudent('1')).resolves.toBe(true);
    expect(repoMock.deleteStudentById).toHaveBeenCalledWith('1');
  });
});

describe('updateStudent', () => {
  test('returns updated student without scores', async () => {
    const toObject = jest.fn().mockReturnValue({
      _id: '1',
      name: 'John',
      scores: [{ exam: 'math', score: 10 }],
    });

    repoMock.updateStudent.mockResolvedValue({ toObject });

    const result = await studentService.updateStudent('1', { name: 'Jane' });

    expect(repoMock.updateStudent).toHaveBeenCalledWith('1', { name: 'Jane' });
    expect(toObject).toHaveBeenCalled();
    expect(result).toEqual({
      _id: '1',
      name: 'John',
      scores: undefined,
    });
  });
});

describe('addScore', () => {
  test('calls repository', async () => {
    repoMock.updateScore.mockResolvedValue({ ok: true });

    await expect(studentService.addScore('1', 'math', 10)).resolves.toEqual({ ok: true });
    expect(repoMock.updateScore).toHaveBeenCalledWith('1', 'math', 10);
  });
});

describe('findByName', () => {
  test('returns students by name', async () => {
    const students = [{ _id: '1', name: 'John' }];
    repoMock.findStudentsByName.mockResolvedValue(students);

    await expect(studentService.findByName('John')).resolves.toEqual(students);
    expect(repoMock.findStudentsByName).toHaveBeenCalledWith('John');
  });
});

describe('countByNames', () => {
  test('returns count from repository', () => {
    repoMock.countStudentsByName.mockReturnValue(3);

    const result = studentService.countByNames(['John', 'Jane']);

    expect(result).toBe(3);
    expect(repoMock.countStudentsByName).toHaveBeenCalledWith(['John', 'Jane']);
  });
});

describe('findByMinScore', () => {
  test('returns students by minimum score', async () => {
    const students = [{ _id: '1', name: 'John' }];
    repoMock.findStudentsMinScore.mockResolvedValue(students);

    await expect(studentService.findByMinScore('math', 50)).resolves.toEqual(students);
    expect(repoMock.findStudentsMinScore).toHaveBeenCalledWith('math', 50);
  });
});