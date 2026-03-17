import Student from "../model/student.js";

export function createStudent(student) {
    return Student.create(student)
}

export function findStudentById(id) {
    return Student.findById(id)
}

export function deleteStudentById(id) {
    return Student.findByIdAndDelete(id)
}

export function updateStudent(id, data) {
    return Student.findByIdAndUpdate(id, data)
}

export function updateScore(id, exam, score) {
    return Student.findByIdAndUpdate(id, {$set: {[`scores.${exam}`]: score}})
}

export function findStudentsByName(name) {
    return Student.find({name: new RegExp(`^${name}$`,  'i')})
}

export function countStudentsByName(name) {
    const regexCondition = names.map(name => ({
        name: new RegExp(`^${name}$`,  'i')
    }));
    return Student.countDocuments({$or: regexCondition})
}

export function findStudentsMinScore(exam, minScore) {
    return Student.find({[`scores.${exam}`]: {$gte: minScore}})
}

// let collection;
//
// export const init = db => collection = db.collection("college");
//
// export const addStudent = async ({id, name, password}) => {
//     const existingStudent = await collection.findOne({_id: id});
//     if (existingStudent) {
//         return false
//     }
//     await collection.insertOne({_id: id, name, password, scores: {}});
//     return true;
// }
//
// export const findStudent = async (id) => {
//     const student = await collection.findOne({_id: id});
//     return renameId(student);
// }
//
// export const deleteStudent = async (id) => {
//     const student = await collection.findOneAndDelete({_id: id});
//     return renameId(student);
// }
//
// export const updateStudent = async (id, data) => {
//     const student = await collection.findOneAndUpdate(
//         {_id: id},
//         {$set: data},
//         {returnDocument: 'after'}
//     );
//     return renameId(student);
// }
//
// export const addScore = async (id, exam, score) => {
//     const student = await collection.findOneAndUpdate(
//         {_id: id},
//         {$set: {[`scores.${exam}`]: score}},
//         {returnDocument: 'after'}
//     );
//     return !!student;
// }
//
// export const findByName = async (name) => {
//     // const data = await collection.find({name: new RegExp(`^${name}$`, "i")}).toArray();
//     const students = [];
//     const cursor = await collection.find({name: new RegExp(`^${name}$`, "i")});
//     while(await cursor.hasNext()) {
//         students.push(renameId(await cursor.next()));
//     }
//     return students;
// }
//
// export const countByNames = async (names) => {
//     let count = 0;
//     for (const name of names) {
//         count += (await collection.find({name: new RegExp(`^${name}$`, "i")}).toArray()).length
//     }
//     return count;
// }
//
// export const findByMinScore = async (exam, minScore) => {
//     // return (await collection.find({[`scores.${exam}`]: {$gte: minScore}}).toArray()).map(renameId);
//     const students = [];
//     const cursor = await collection.find({[`scores.${exam}`]: {$gte: minScore}});
//     for await (const student of cursor) {
//         students.push(renameId(student));
//     }
//     return students;
// }
//
// function renameId(student) {
//     if (student) {
//         student.id = student._id;
//         delete student._id;
//     }
//     return student;
// }