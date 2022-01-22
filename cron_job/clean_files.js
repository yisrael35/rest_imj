const fs = require('fs')
const path = require('path')

const clean_files = async () => {
  try {
    const dit_path = path.join(path.resolve(), '..', 'files')
    const files = fs.readdirSync(dit_path)
    files.forEach((file) => {
      if (file !== '.gitkeep') {
        const file_path = path.join(path.resolve(), '..', 'files', file)
        fs.unlinkSync(file_path)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
clean_files()
