import * as repo from '../repository/studentRepository.js';

export const addStudent = async ({id, name, password}) => {
    if (await repo.findStudentById(id)) {
        return false
    }
    await repo.createStudent({_id: id, name, password})
    return true
}

export const findStudent = async (id) => {
    // TODO
}

export const deleteStudent = async (id) => {
    // TODO
}

export const updateStudent = async (id, data) => {
    // TODO
}

export const addScore = async (id, exam, score) => {
    // TODO
}

export const findByName = async (name) => {
    // TODO
}

export const countByNames = async (names) => {
    // TODO
}

export const findByMinScore = async (exam, minScore) => {
    // TODO
}

function renameId(student) {
    if (student) {
        student.id = student._id;
        delete student._id;
    }
    return student;
}