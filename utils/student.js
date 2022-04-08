const knex = require('../db.js')

module.exports = {
  getStudentGradesAndDetails
}

async function getStudentGradesAndDetails (grades, studentId) {
  const id = Number(studentId)
  const [student] = (await knex('students').where({ id: studentId }))
  if (!student) return null
  delete student.password_hash
  const studentGrades = grades
    .filter((student) => student.id === id)
    .map(({ grade, course }) => ({ grade, course }))
  return { ...student, grades: studentGrades }
}
