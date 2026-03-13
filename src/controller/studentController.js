import * as repo from '../repository/studentRepository.js';

export const addStudent = async (req, res) => {
    const success = await repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409).send();
    }
}

export const findStudent = async (req, res) => {
    const student = await repo.findStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    } else {
        res.status(404).send();
    }
}

export const deleteStudent = async (req, res) => {
    const student = await repo.deleteStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    } else {
        res.status(404).send();
    }
}

export const updateStudent = async (req, res) => {
    const student = await repo.updateStudent(+req.params.id, req.body);
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
    const students = repo.findByName(req.params.name).map(({password, ...studentWithoutPassword}) => studentWithoutPassword);
    res.json(students);
}

export const studentsCountByNames = (req, res) => {
    let count = 0;
    const names = req.query.names;
    const list = Array.isArray(names) ? names : [names];
    if (names) {
        count = repo.countByNames(list)
    }
    res.status(200).send(count);
}

export const findStudentByMinScore = async (req, res) => {
    const students = await repo.findByMinScore(req.params.exam, +req.params.minScore);
    res.json(students);
}