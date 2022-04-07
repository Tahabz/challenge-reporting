const grades = require('../grades.json')

function getCoursesStats (grades) {
  const gradesByCourse = groupGradesByCourse(grades)
  return buildStatsObject(gradesByCourse)
}

function groupGradesByCourse (grades) {
  return grades.reduce((grades, gradeInfo) => {
    if (!Array.isArray(grades[gradeInfo.course])) grades[gradeInfo.course] = []
    grades[gradeInfo.course].push(gradeInfo.grade)
    return grades
  }, {})
}

function buildStatsObject (gradesByCourse) {
  return Object.assign(
    ...Object.keys(gradesByCourse).map((course) => ({
      [course]: {
        maxGrade: Math.max(...gradesByCourse[course]),
        minGrade: Math.min(...gradesByCourse[course]),
        average: getAverage(gradesByCourse[course]).toFixed(2)
      }
    }))
  )
}

function getAverage (arr) {
  return arr.reduce((acc, curr) => acc + curr, 0) / arr.length
}

process.send(getCoursesStats(grades))
