const childProcess = require('child_process')

const knex = require('./db')
const { getStudentGradesAndDetails } = require('./utils/student')
const grades = require('./grades.json')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const student = await knex('students').where({ id: req.params.id })
    res.json(student[0])
  } catch (e) {
    next(e)
  }
}

async function getStudentGradesReport (req, res, next) {
  try {
    res.json(await getStudentGradesAndDetails(grades, req.params.id))
  } catch (e) {
    next(e)
  }
}

async function getCourseGradesReport (req, res, next) {
  const prc = childProcess.fork('./utils/course.js')
  prc
    .on('message', (data) => {
      res.send(data)
    })
    .on('error', next)
}
