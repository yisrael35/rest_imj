const axios = require('axios')
require('dotenv').config()
const Logger = require('logplease')
const logger = Logger.create('./test/auth.test.js')

let token
const url = process.env.TEST_URL
let username = 'yisrael@gmail.com'
const password = process.env.PASSWORD_TEST

const generate_password = (length) => {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var characters_length = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters_length))
  }
  return result
}

const random_name = generate_password(10)

test('test of signin fields', async () => {
  try {
    const result = await axios.put(url + '/auth', { username, password })
    token = result.data.token
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    expect(result.status).toBe(200)
    expect(result.data).toHaveProperty('token')
    expect(result.data).toHaveProperty('user')
  } catch (error) {
    logger.error('error in sign_in')
    logger.error(error.response.status)
  }
})

test('test of signup', async () => {
  try {
    let new_user = { username: random_name, password, first_name: random_name + 'test', last_name: random_name + 'test1', email: random_name + '@imj.org.il' }

    const result = await axios.post(url + '/auth', new_user)
    expect(result.status).toBe(200)
  } catch (error) {
    logger.error('error in signup')
    logger.error(error.response.status)
  }
})

test(' delete user by id ', async () => {
  try {
    let res_get_users = await axios.get(`${url}/user/?search=${encodeURIComponent(random_name)}`)
    let user_id = res_get_users.data.users[0].id

    let res_delete_user = await axios.delete(`${url}/user/${user_id}`)
    expect(res_delete_user.status).toBe(200)
  } catch (error) {
    logger.log(error.response.status)

    expect(false).toBeTruthy()
  }
})

test('test of signout', async () => {
  const result = await axios.delete(url + '/auth')
  expect(result.status).toBe(200)
})
