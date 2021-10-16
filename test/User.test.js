const axios = require('axios')
require('dotenv').config()

const random_name = generate_password(10)
const url = process.env.APP_URL_TEST
// Truthy
test('Check create user if it added to the db', async () => {
  try {
    let body = {
      username: process.env.USERNAME_TEST,
      password: process.env.PASSWORD_TEST,
    }

    const auth = await axios.put(`${url}/auth`, body)
    const token = auth.data.token
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    let res_get_users = await axios.get(`${url}/user`)
    expect(res_get_users.data.meta_data.sum_rows > 0).toBeTruthy()
    let sum_of_users = res_get_users.data.meta_data.sum_rows
    let new_user = {
      name: random_name,
      username: 'user_test2',
      email: 'user_test@makor-capital.com',
    }
    let res_create_user = await axios.post(`${url}/user`, new_user)
    expect(res_create_user.status).toBe(200)

    res_get_users = await axios.get(`${url}/user`, config)
    expect(res_get_users.data.meta_data.sum_rows == sum_of_users + 1).toBeTruthy()
  } catch (err) {
    expect(false).toBeTruthy()
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
    expect(res_user.data).toHaveProperty('is_active')
    expect(res_user.data).toHaveProperty('created_at')
  } catch (err) {
    expect(false).toBeTruthy()
  }
})

test('Check update user by id ', async () => {
  try {
    let res_get_users = await axios.get(`${url}/user`)
    let user_id = res_get_users.data.users[0].id
    let update_user = {
      name: 'yisrael - azriel',
    }
    let res_update_user = await axios.put(`${url}/user/${user_id}`, update_user)
    expect(res_update_user.status).toBe(200)

    let res_user = await axios.get(`${url}/user/${user_id}`)
    expect(res_user.status).toBe(200)
    expect(res_user.data.name).toBe(update_user.name)
  } catch (err) {
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
  } catch (err) {
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
      email: 'user_test@makor-capital.com',
      phone: '052350539',
    }
    // unexpected params
    await axios.post(`${url}/user`, new_user).catch((error) => {
      expect(error.response.status).toBe(400)
    })

    new_user = {
      email: 'user_test@makor-capital.com',
    }
    //missing params
    await axios.post(`${url}/user`, new_user).catch((error) => {
      expect(error.response.status).toBe(400)
    })
  } catch (err) {
    expect(false).toBeTruthy()
  }
})

test('Check get user by id unexpected fields', async () => {
  try {
    let res_get_users = await axios.get(`${url}/user`)
    let user_id = res_get_users.data.users[0].id
    let res_user = await axios.get(`${url}/user/${user_id}`)

    expect(res_user.status).toBe(200)
    // unexpected fields
    expect(res_user.data).not.toHaveProperty('level')
    expect(res_user.data).not.toHaveProperty('phone')
  } catch (err) {
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
      name: 'yisrael - azriel',
    }
    // made up id
    await axios.put(`${url}/user/1234`, update_user).catch((error) => {
      expect(error.response.status).toBe(404)
    })
  } catch (err) {
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
      expect(error.response.status).toBe(405)
    })
  } catch (err) {
    expect(false).toBeTruthy()
  }
})
