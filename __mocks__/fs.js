const fs = jest.genMockFromModule('fs') /*假的fs*/
const _fs = jest.requireActual('fs') /*真正的fs*/

Object.assign(fs, _fs)/*将真正的 fs 身上的所有东西复制给假的 fs */

let readMocks = {}
fs.setReadFileMock = (path, error, data) => {
  readMocks[path] = [error, data]
}
/*覆盖 readFile */
fs.readFile = (path, options, callback) => {
  if (callback === undefined) { callback = options }
  if (path in readMocks) {
    // console.log(callback.toString())
    callback(...readMocks[path])
  } else {
    _fs.readFile(path, options, callback)
  }
}

let writeMocks = {}
fs.setWriteFileMock = (path, fn)=> {
  writeMocks[path] = fn
}
/*覆盖 writeFile */
fs.writeFile = (path, data, options, callback) => {
  if (callback === undefined) { callback = options }
  if(path in writeMocks){
    writeMocks[path](path,data,options,callback)
  }else{
    _fs.writeFile(path,data,options,callback)
  }
}

/* 清除 Mocks */
fs.clearMocks = ()=>{
  readMocks = {}
  writeMocks = {}
}

module.exports = fs