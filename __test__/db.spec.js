const db = require('../db.js')
const fs = require('fs')/*真的fs*/
jest.mock('fs')/*假的fs*/

describe('db', () => {

  /*意思是每一个 it 后面执行*/
  afterEach(() => {
    fs.clearMocks()
  })

  it('can read', async () => {
    const data = [{title: 'hi', done: true}]
    fs.setReadFileMock('/xxx', null, JSON.stringify(data))
    const list = await db.read('/xxx')
    expect(list).toStrictEqual(data)
    /*清除mock*/
    fs.clearMocks()
  })

  it('can write', async () => {
    let fakeFile = null
    const list = [
      {title: '见桥本环奈', done: true},
      {title: '见新垣结衣', done: true}
    ]
    fs.setWriteFileMock('/yyy', (path, data, callback) => {
      fakeFile = data
      callback(null)
    })
    await db.write(list, '/yyy')
    expect(fakeFile).toBe(JSON.stringify(list) + '\n')
    fs.clearMocks()
  })
})