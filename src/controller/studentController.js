import * as repo from '../repository/studentRepository.js';

export const addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409).send();
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    } else {
        res.status(404).send();
    }
}

export const deleteStudent = (req, res) => {
    const student = repo.deleteStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    } else {
        res.status(404).send();
    }
}

export const updateStudent = (req, res) => {
    const student = repo.updateStudent(+req.params.id, req.body);
    if (student) {
        const {scores, ...studentWithoutScore} = student;
        res.json(studentWithoutScore);
    } else {
        res.status(404).send();
    }
}

export const addScore = (req, res) => {
    const success = repo.addScore(+req.params.id, req.body.examName, req.body.score);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json({
            timestamp: new Date().toISOString(),
            status: 404,
            error: "Not Found",
            message: "student not found",
            path: `/score/student/${req.params.id}`
        });
    }
}

export const findStudentsByName = (req, res) => {
    const students = repo.findByName(req.params.name);
    res.json(students);
}

export const studentsCountByNames = (req, res) => {
    let count = 0
    if (req.query.names) {
        count = repo.countByNames(req.query.names)
    }
    res.status(200).send(count);
}

export const findStudentByMinScore = (req, res) => {
    const students = repo.findByMinScore(req.params.exam, +req.params.minScore);
    res.json(students);
}