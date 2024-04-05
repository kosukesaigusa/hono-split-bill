import app from '../src'

describe('GET /', () => {
  test('should return status 200', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ message: 'Hello, World!' })
  })
})
