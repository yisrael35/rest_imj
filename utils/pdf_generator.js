const Logger = require('logplease')
const logger = Logger.create('./utils/pdf_generator.js')
const pdfmake = require('pdfmake')
const fs = require('fs')
const path = require('path')

const db_helper = require('./db_helper')
const query = require('../sql/queries/pdf_generator')
// const pdf_temp = require('./edit_pdf/pdf_editor')

const fonts = {
  Roboto: {
    normal: path.join(path.resolve(), 'utils', 'edit_pdf', 'Open Sans Hebrew', 'OpenSansHebrew-Regular.ttf'),
    bold: path.join(path.resolve(), 'utils', 'edit_pdf', 'Open Sans Hebrew', 'OpenSansHebrew-Bold.ttf'),
    italics: path.join(path.resolve(), 'utils', 'edit_pdf', 'Open Sans Hebrew', 'OpenSansHebrew-Italic.ttf'),
    bolditalics: path.join(path.resolve(), 'utils', 'edit_pdf', 'Open Sans Hebrew', 'OpenSansHebrew-Bolditalic.ttf'),
  },
}

const pdf_generator = async (id, fields) => {
  try {
    const [event_type_details] = await db_helper.get(query.get_event_type(id))
    if (!event_type_details) {
      console.log('couldnt get event type from db')
      return { status: 404 }
    }
    let pdf_content = event_type_details['content']

    for (let [key, value] of Object.entries(fields)) {
      pdf_content = pdf_content.replace(new RegExp('#' + key, 'g'), value)
    }
    if (fields['language'].toLowerCase() == 'hebrew') {
      pdf_content = pdf_content.replace('\n', '^')
    }
    if (typeof pdf_content != 'json') {
      pdf_content = JSON.parse(pdf_content)
    }

    if (fields['language'].toLowerCase() == 'hebrew') {
      for (i in pdf_content['content']) {
        var pdf_text = pdf_content['content'][i]['text']
        pdf_content['content'][i]['text'] = str_to_he(pdf_text)
      }
    }

    let file_name = `${id}_${new Date().getTime()}.pdf`
    let pdf_path = `./files/${file_name}`
    let printer = new pdfmake(fonts)
    let pdfDoc = printer.createPdfKitDocument(pdf_content)
    pdfDoc.pipe(fs.createWriteStream(pdf_path))
    pdfDoc.end()
    return { status: 200, file_name }
  } catch (error) {
    logger.error(error)
    return { status: 500 }
  }
}

const replace_str = (str, to, index) => {
  var chars = str.split('')
  chars[index] = to
  return chars.join('')
}

const replace_to_br = (str) => {
  let str_arr = []
  let temp = ''
  for (word in str) {
    for (ch in str[word]) {
      if (str[word][ch] == '^') {
        str_arr.push(temp)
        temp = ''
        str_arr.push('\n')
      } else {
        temp += str[word][ch]
      }
    }
    temp += ' '
  }
  str_arr.push(temp)
  str_arr = str_arr.reverse()
  for (i in str_arr) {
    str_arr[i] = str_arr[i].split(' ').reverse().join(' ')
  }
  return str_arr
}

const str_to_he = (str = '') => {
  if (str == '') return ''
  str = str.split(' ')
  str[0] = ' ' + str[0]
  for (word in str) {
    for (ch in str[word]) {
      if (str[word][ch] == '(') {
        str[word] = replace_str(')', ch)
        last_change_ch = ch
        last_change_word = word
      } else if (str[word][ch] == ')') {
        str[word] = replace_str('(', ch)
        last_change_ch = ch
        last_change_word = word
      }
    }
  }
  str = replace_to_br(str)
  return str.reverse().join(' ')
}

module.exports = {
  pdf_generator,
}
