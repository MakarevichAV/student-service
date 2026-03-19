import * as repo from '../repository/studentRepository.js';

export const addStudent = async ({id, name, password}) => {
    if (await repo.findStudentById(id)) {
        return false
    }
    await repo.createStudent({_id: id, name, password})
    return true
}

export const findStudent = async (id) => {
    const student = await repo.findStudentById(id)
    if (student) {
        student.password = undefined;
        return renameId(student);
    }
    return student
}

export const deleteStudent = async (id) => {
    const student = await repo.deleteStudentById(id)
    if (student) {
        student.password = undefined;
        return renameId(student);
    }
    return student
}

export const updateStudent = async (id, data) => {
    const student = await repo.updateStudent(id, data)
    console.log(student)
    if (student) {
        student.scores = undefined;
        return renameId(student);
    }
    return student
}

export const addScore = async (id, exam, score) => {
    await repo.updateScore(id, exam, score)
    return true
}

export const findByName = async (name) => {
    const students = await repo.findStudentsByName(name)
    for (const student of students) {
        student.password = undefined;
    }
    return students.map(renameId)
}

export const countByNames = async (names) => {
    return await repo.countStudentsByName(names)
}

export const findByMinScore = async (exam, minScore) => {
    const students = await repo.findStudentsMinScore(exam, minScore)
    for (const student of students) {
        student.password = undefined;
    }
    return students.map(renameId)
}

function renameId(student) {
    if (student) {
        student.id = student._id;
        delete student._id;
    }
    return student;
}