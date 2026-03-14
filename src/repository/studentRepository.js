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

export const findByName = async (name) => {
    const data = await collection.find({name: new RegExp(`^${name}$`, "i")}).toArray();
    return data.map(renameId)
}

export const countByNames = async (names) => {
    let count = 0;
    for (const name of names) {
        count += (await collection.find({name: new RegExp(`^${name}$`, "i")}).toArray()).length
    }
    return count;
}

export const findByMinScore = async (exam, minScore) => {
    return (await collection.find({[`scores.${exam}`]: {$gte: minScore}}).toArray()).map(renameId);
}

function renameId(student) {
    if (student) {
        student.id = student._id;
        delete student._id;
    }
    return student;
}