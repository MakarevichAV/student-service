import {Router} from "express";
import {
    addScore,
    addStudent,
    deleteStudent,
    findStudent,
    findStudentByMinScore,
    findStudentsByName,
    studentsCountByNames,
    updateStudent
} from "../controller/studentController.js";

const router = Router();

router.post("/student", addStudent);
router.get("/student/:id", findStudent);
router.delete("/student/:id", deleteStudent);
router.patch("/student/:id", updateStudent);
router.patch("/score/student/:id", addScore);
router.get("/students/name/:name", findStudentsByName);
router.get("/quantity/students", studentsCountByNames);
router.get("/students/exam/:exam/minscore/:minScore", findStudentByMinScore);

export default router;