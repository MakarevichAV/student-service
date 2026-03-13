import {Student} from "../model/student.js";

const students = new Map();

export const addStudent = ({id, name, password}) => {
    if (students.has(id)) {
        return false;
    }
    students.set(id, new Student(id, name, password));

    return true;
}

export const findStudent = (id) => {
    return students.get(id);
}

export const deleteStudent = (id) => {
    const student = students.get(id);
    if (student) {
        students.delete(id);
        return student;
    }
}

export const updateStudent = (id, data) => {
    const student = students.get(id);
    if (student) {
        // students.set(id, {...student,  ...data});
        // return students.get(id);
        Object.assign(student, data);
        return student;
    }
}

export const addScore = (id, exam, score) => {
    const student = students.get(id);
    if (student) {
        Object.assign(student.scores, {[exam]: score});
        return true;
    } else {
        return false;
    }
}

export const findByName = (name) => {
    return Array.from(students.values())
        .filter(student => student.name.toLowerCase() === name.toLowerCase());
}

export const countByNames = (names) => {
    let count = 0;
    for (const name of names) {
        count += Array.from(students.values()).filter(student => student.name.toLowerCase() === name.toLowerCase()).length;
    }
    return count;
}

export const findByMinScore = (exam, minScore) => {
    const result = [];
    for (const student of students.values()) {
        console.log(student.scores[exam])
        if (student.scores[exam] && student.scores[exam] >= minScore) {
            const {password, ...studentWithoutPassword} = student;
            result.push(studentWithoutPassword);
        }
    }
    return result;
}