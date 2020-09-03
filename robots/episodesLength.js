const fs = require('fs')

const ropb = () => {
  const object = JSON.parse(fs.readFileSync("./content/infos/colectorCode3.json"))
  console.log(object.length)
}
ropb()