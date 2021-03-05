// Manage the transcript database locally
import {
  StudentID,
  Student,
  Course,
  Grade,
  CourseGrade,
  Transcript,
  TranscriptManager,
  CourseDescription,
} from "./transcript";
// manage the transcript database

// the database of transcript
let allTranscripts: Transcript[] = [];
let allCoursesDescriptions: CourseDescription[] = [];

export function initialize() {
  allTranscripts = [];
  allCoursesDescriptions = [];
  StudentIDManager.reset();
  addCourseDescription('CS5500', 'Software Engineering at NEU for Graduate Studnets');
  addCourseDescription('CS4300', 'Introduction to Computer Graphics at NEU for undergraduate studnets');
  addCourseDescription('CS2500', 'Fundmental of Computer Science I at NEU for undergraduate studnets');
  addCourseDescription('DS4400', 'Machine Learning I');
  addCourseDescription('MATH3081', 'Probability and Statistics');
  addStudent("avery", [
    { course: "DemoClass", grade: 100 },
    { course: "DemoClass2", grade: 100 },
  ]);
  addStudent("blake", [{ course: "DemoClass", grade: 80 }]);
  addStudent("blake", [
    { course: "DemoClass", grade: 85 },
    { course: "DemoClass2", grade: 40 },
  ]);
  addStudent("casey", [{ course: "DemoClass2", grade: 100 }]);
}

export function getAll() {
  return allTranscripts;
}

// manages the student IDs
class StudentIDManager {
  private static lastUsedID = 0;

  static reset() {
    this.lastUsedID = 0;
  }

  public static newID(): number {
    this.lastUsedID++;
    return this.lastUsedID;
  }
}

// relies on freshness of studentIDs.
export function addStudent(
  name: string,
  grades: CourseGrade[] = []
): StudentID {
  const newID = StudentIDManager.newID();
  const newStudent = { studentID: newID, studentName: name };
  allTranscripts.push({ student: newStudent, grades: grades });
  return newID;
}

// gets transcript for given ID.  Returns undefined if missing
export function getTranscript(studentID: number): Transcript | undefined {
  return allTranscripts.find(
    (transcript) => transcript.student.studentID === studentID
  );
}

// gets studentIDs matching a given name
export function getStudentIDs(studentName: string): StudentID[] {
  return allTranscripts
    .filter((transcript) => transcript.student.studentName === studentName)
    .map((transcript) => transcript.student.studentID);
}

// deletes student with the given ID from the database.
// throws exception if no such student.  (Is this the best idea?)
export function deleteStudent(studentID: StudentID): void {
  const index = allTranscripts.findIndex(
    (t) => t.student.studentID === studentID
  );
  if (index === -1) {
    throw new Error(`no student with ID = ${studentID}`);
  }
  allTranscripts.splice(index, 1);
}

export function addGrade(
  studentID: StudentID,
  course: Course,
  grade: number
): void {
  const tIndex = allTranscripts.findIndex(
    (t) => t.student.studentID === studentID
  );
  if (tIndex === -1) {
    throw new Error(`no student with ID = ${studentID}`);
  }
  const theTranscript = allTranscripts[tIndex];
  try {
    allTranscripts[tIndex] = addGradeToTranscript(theTranscript, course, grade);
  } catch (e) {
    throw new Error(
      `student ${studentID} already has a grade in course ${course}`
    );
  }
}

// returns transcript like the original, but with the new grade added.
// throws an error if the course is already on the transcript
function addGradeToTranscript(
  theTranscript: Transcript,
  course: Course,
  grade: number
): Transcript {
  const { grades } = theTranscript;
  const index = grades.findIndex((entry) => entry.course === course);
  if (index !== -1) {
    // idempotency:
    if (grades[index].grade === grade) return theTranscript;
    throw new Error();
  }
  return {
    student: theTranscript.student,
    grades: grades.concat({ course, grade }),
  };
}

//
export function getGrade(studentID: StudentID, course: Course): number {
  const theTranscript = allTranscripts.find(
    (t) => t.student.studentID === studentID
  );
  const theGrade = theTranscript?.grades.find((g) => g.course === course);
  if (theGrade === undefined) {
    throw new Error(`no grade for student ${studentID} in course ${course}`);
  }

  return theGrade.grade;
}

export function getCourseDescriptions(): CourseDescription[] {
  return allCoursesDescriptions;
}

export function getCourseDescription(courseName: Course) {
  return allCoursesDescriptions.find((cd) => cd.courseName === courseName);
}

export function addCourseDescription(courseName: Course, description: string) {
  if (allCoursesDescriptions.find((course) => course.courseName === courseName) !==undefined) {
    throw new Error(`Cannot add a existing course`);
  } else {
    allCoursesDescriptions.push({
      courseName: courseName, 
      description: description
    })
  }
}

export const transcriptManager: TranscriptManager = {
  addStudent(name: string) {
    return addStudent(name, []);
  },
  getStudentIDs(name?: string): StudentID[] {
    if (name) {
      return getStudentIDs(name);
    } else {
      return allTranscripts.map((t) => t.student.studentID);
    }
  },
  getAll: getAll,
  getTranscript: getTranscript,
  addGrade: addGrade,
  getGrade(studentID: StudentID, course: Course): Grade | undefined {
    try {
      return getGrade(studentID, course);
    } catch {
      return undefined;
    }
  },
  getCourseDescriptions: getCourseDescriptions,
  getCourseDescription: getCourseDescription,
  addCourseDescription: addCourseDescription
};
