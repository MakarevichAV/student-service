let collection;

export const init = db => collection = db.collection("college");

export const addStudent = async ({id, name, password}) => {
    const existingStudent = await collection.findOne({_id: id});
    if (existingStudent) {
        return false
    }
    await collection.insertOne({_id: id, name, password, scores: {}});
    return true;
}

export const findStudent = async (id) => {
    const student = await collection.findOne({_id: id});
    return renameId(student);
}

export const deleteStudent = async (id) => {
    const student = await collection.findOneAndDelete({_id: id});
    return renameId(student);
}

export const updateStudent = async (id, data) => {
    const student = await collection.findOneAndUpdate(
        {_id: id},
        {$set: data},
        {returnDocument: 'after'}
    );
    return renameId(student);
}

export const addScore = async (id, exam, score) => {
    const student = await collection.findOneAndUpdate(
        {_id: id},
        {$set: {[`scores.${exam}`]: score}},
        {returnDocument: 'after'}
    );
    return !!student;
}

export const findByName = (name) => {
    // TODO
    // return Array.from(students.values())
    //     .filter(student => student.name.toLowerCase() === name.toLowerCase());
}

export const countByNames = (names) => {
    // TODO
    // let count = 0;
    // for (const name of names) {
    //     count += Array.from(students.values()).filter(student => student.name.toLowerCase() === name.toLowerCase()).length;
    // }
    // return count;
}

export const findByMinScore = async (exam, minScore) => {
    return renameId(await collection.find({[`scores.${exam}`]: {$gte: minScore}}).toArray());
}

function renameId(student) {
    if (student) {
        student.id = student._id;
        delete student._id;
    }
    return student;
}