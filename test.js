const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')
const grades = require('./grades.json')
const { getStudentGradesAndDetails } = require('./utils/student')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('getStudent', async function (t) {
  const url = `${endpoint}/student/44`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.deepEqual({
      id: 44,
      first_name: 'Elody',
      last_name: 'Hudson',
      email: 'Elody67@hotmail.com',
      is_registered: 0,
      is_approved: 1,
      address: '238 Hilll Garden Suite 822',
      city: 'Cheyenne',
      state: 'PA',
      zip: '78421',
      phone: '1-354-741-0049',
      created: '1628789640104.0',
      last_login: '1628746706627.0',
      ip_address: '218.151.239.16'
    }, data, 'should equal expected student')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('do not getStudent', async function (t) {
  const url = `${endpoint}/student/-44`
  try {
    const { response } = await jsonist.get(url)
    t.isEqual(404, response.statusCode, 'should be 404')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('do not getStudentGradesAndDetails HTTP', async function (t) {
  const url = `${endpoint}/student/-44/grades`
  try {
    const { response } = await jsonist.get(url)
    t.isEqual(404, response.statusCode, 'should be 404')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('do not getStudentGradesAndDetails', async function (t) {
  const data = await getStudentGradesAndDetails(grades, -2)
  try {
    t.isEqual(data, null, 'should be null')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('getCoursesStats', async function (t) {
  try {
    const data = await getStudentGradesAndDetails(grades, 3556)
    t.deepEqual({
      id: 3556,
      first_name: 'Floy',
      last_name: 'Walker',
      email: 'Floy_Walker@hotmail.com',
      is_registered: 1,
      is_approved: 0,
      address: '5033 Zulauf Common Suite 465',
      city: 'Pomona',
      state: 'NH',
      zip: '38963-0488',
      phone: '(932) 820-6677 x31142',
      created: '1628782818068.0',
      last_login: '1628744486508.0',
      ip_address: '47.63.154.15',
      grades: []
    }
    , data, 'should equal expected student and grades')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('getCoursesStats HTTP', async function (t) {
  const url = `${endpoint}/student/355/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.deepEqual({
      id: 355,
      first_name: 'Torrance',
      last_name: 'Kuvalis',
      email: 'Torrance95@yahoo.com',
      is_registered: 0,
      is_approved: 0,
      address: '381 Doug Wall Apt. 055',
      city: 'Arecibo',
      state: 'MN',
      zip: '26662-0061',
      phone: '803-948-2793',
      created: '1628710444281.0',
      last_login: '1628735682989.0',
      ip_address: '207.143.185.68',
      grades: [
        {
          grade: 17,
          course: 'Calculus'
        },
        {
          grade: 33,
          course: 'Microeconomics'
        }
      ]
    }
    , data, 'should equal expected student and grades')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('getStudent', async function (t) {
  const url = `${endpoint}/course/all/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.deepEqual({
      Calculus: {
        maxGrade: 100,
        minGrade: 0,
        average: '50.09'
      },
      Microeconomics: {
        maxGrade: 100,
        minGrade: 0,
        average: '49.81'
      },
      Statistics: {
        maxGrade: 100,
        minGrade: 0,
        average: '50.02'
      },
      Astronomy: {
        maxGrade: 100,
        minGrade: 0,
        average: '50.04'
      },
      Philosophy: {
        maxGrade: 100,
        minGrade: 0,
        average: '50.02'
      }
    }, data, 'should equal expected course stats')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
