const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

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

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
