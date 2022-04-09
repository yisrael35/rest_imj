const axios = require('axios')
require('dotenv').config()
const Logger = require('logplease')
const logger = Logger.create('./test/user.test.js')

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
const url = process.env.TEST_URL
const password = process.env.PASSWORD_TEST

// Truthy
test('Check create user if it added to the db', async () => {
  try {
    let body = {
      username: process.env.USERNAME_TEST,
      password,
    }
    const auth = await axios.put(`${url}/auth`, body)
    const token = auth.data.token
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    let res_get_users = await axios.get(`${url}/user`)
    expect(res_get_users.data.meta_data.sum_rows > 0).toBeTruthy()
    let sum_of_users = res_get_users.data.meta_data.sum_rows
    let new_user = { username: random_name, password, first_name: random_name + 'test', last_name: random_name + 'test1', email: random_name + '@gmail.com' }
    let res_create_user = await axios.post(`${url}/user`, new_user)
    expect(res_create_user.status).toBe(200)

    res_get_users = await axios.get(`${url}/user`)
    expect(res_get_users.data.meta_data.sum_rows == sum_of_users + 1).toBeTruthy()
  } catch (error) {
    logger.error(error)
    expect(false).toBeTruthy()
    logger.error(error.response.status)
  }
})

test('Check get user by id fields', async () => {
  try {
    let res_get_users = await axios.get(`${url}/user`)
    let user_id = res_get_users.data.users[0].id
    let res_user = await axios.get(`${url}/user/${user_id}`)

    expect(res_user.status).toBe(200)
    expect(res_user.data).toHaveProperty('id')
    expect(res_user.data).toHaveProperty('username')
    expect(res_user.data).toHaveProperty('first_name')
    expect(res_user.data).toHaveProperty('last_name')
    expect(res_user.data).toHaveProperty('email')
    expect(res_user.data).toHaveProperty('level')
    expect(res_user.data).toHaveProperty('is_active')
    expect(res_user.data).toHaveProperty('created_at')
  } catch (error) {
    logger.error(error.response.status)
    expect(false).toBeTruthy()
  }
})

test('Check update user by id ', async () => {
  try {
    let res_get_users = await axios.get(`${url}/user`)
    const users_len = res_get_users.data.users.length
    let user_id = res_get_users.data.users[users_len - 1].id
    let update_user = {
      first_name: 'yisrael - azriel',
    }
    let res_update_user = await axios.put(`${url}/user/${user_id}`, update_user)
    expect(res_update_user.status).toBe(200)

    let res_user = await axios.get(`${url}/user/${user_id}`)
    expect(res_user.status).toBe(200)
    expect(res_user.data.first_name).toBe(update_user.first_name)
  } catch (error) {
    logger.error(error.response.status)

    expect(false).toBeTruthy()
  }
})

test('Check delete user by id ', async () => {
  try {
    let res_get_users = await axios.get(`${url}/user/?search=${encodeURIComponent(random_name)}`)
    let user_id = res_get_users.data.users[0].id

    let res_delete_user = await axios.delete(`${url}/user/${user_id}`)
    expect(res_delete_user.status).toBe(200)

    let res_user = await axios.get(`${url}/user/${user_id}`)
    expect(res_user.status).toBe(200)
    expect(res_user.data.is_active).toBe(0)
  } catch (error) {
    logger.error(error.response.status)

    expect(false).toBeTruthy()
  }
})

// Falsy
test('Check create user if it fails', async () => {
  try {
    let new_user = {
      first_name: 'new user',
      name: 'new user',
      username: 'user_test2',
      level: '1',
      email: 'user_test@yisraelbar.xyz',
      phone: '052350539',
    }
    // unexpected params
    await axios.post(`${url}/user`, new_user).catch((error) => {
      expect(error.response.status).toBe(400)
    })

    new_user = {
      email: 'user_test@yisraelbar.com',
    }
    //missing params
    await axios.post(`${url}/user`, new_user).catch((error) => {
      expect(error.response.status).toBe(400)
    })
  } catch (error) {
    logger.error(error.response.status)

    expect(false).toBeTruthy()
  }
})

test('Check get user by id wrong id', async () => {
  try {
    await axios.get(`${url}/user/11`).catch((error) => {
      expect(error.response.status).toBe(404)
    })
  } catch (error) {
    logger.error(error.response.status)

    expect(false).toBeTruthy()
  }
})

test('Check update user by id ', async () => {
  try {
    let res_get_users = await axios.get(`${url}/user`)
    let user_id = res_get_users.data.users[0].id
    let update_user = {
      made_up_field: 'yisrael - azriel',
    }
    //made up field
    await axios.put(`${url}/user/${user_id}`, update_user).catch((error) => {
      expect(error.response.status).toBe(400)
    })
    //empty object
    await axios.put(`${url}/user/${user_id}`, {}).catch((error) => {
      expect(error.response.status).toBe(400)
    })

    update_user = {
      first_name: 'yisrael - azriel',
    }
    // made up id
    await axios.put(`${url}/user/1234`, update_user).catch((error) => {
      expect(error.response.status).toBe(404)
    })
  } catch (error) {
    logger.error(error.response.status)

    expect(false).toBeTruthy()
  }
})

test('Check delete user by id ', async () => {
  try {
    //made up id
    await axios.delete(`${url}/user/1234`).catch((error) => {
      expect(error.response.status).toBe(404)
    })
    // id is missing
    await axios.delete(`${url}/user`).catch((error) => {
      expect(error.response.status).toBe(404)
    })
  } catch (error) {
    logger.error(error.response)
    expect(false).toBeTruthy()
  }
})

test('delete token', async () => {
  const result = await axios.delete(url + '/auth')
  expect(result.status).toBe(200)
})
