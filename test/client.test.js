const axios = require('axios')
require('dotenv').config()

let token
const url = process.env.TEST_URL
test('test of signup', async () => {
  try {
    const result = await axios.post(url + '/auth', { username: 'yisrael@gmail.com', password: '12345678',
    name:"yisrael"
  })
    token = result.data.token
    expect(result.status).toBe(200)
  } catch (error) {
    console.log('error in signup')
    console.log(error.response.status)
  }
})
test('test of signin', async () => {
  try {
    const result = await axios.put(url + '/auth', { username: 'y@gmail.com', password: '12345678' })
    token = result.data.token
    expect(result.status).toBe(200)
    expect(result.data).toHaveProperty('token')
    expect(result.data).toHaveProperty('user')
  } catch (error) {
    console.log('error in signin')
    console.log(error.response.status)
  }
})

test('test of signout', async () => {
    const result = await axios.delete(url + '/auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(result.status).toBe(200)
})
