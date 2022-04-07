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
      password_hash: '0190b9d5de6e72fa1a7b45f437a0384fe5c1a112',
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
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.isEqual(data, null, 'should be null')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('do not getStudentGradesAndDetails', async function (t) {
  const data = await getStudentGradesAndDetails(grades, -2)
  try {
    t.isEqual(data, undefined, 'should be undefined')
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
      password_hash: '4e2281d392f8b353767918febb9871633b258018',
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
