const pdfmake = require('pdfmake')
const fs = require('fs')

const fonts = {
  Roboto: {
    normal: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Regular.ttf',
    bold: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Bold.ttf',
    italics: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Italic.ttf',
    bolditalics: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Bolditalic.ttf',
  },
}

let lang = 'Hebrew'

let pdf_content = {
  content: [
    { text: 'הצעת מחיר לאירוע במוזיאון ישראל', style: 'header', fontSize: 18, alignment: 'center', bold: true, direction: 'LTR' },
    { text: 'תאריך האירוע: #event_date', alignment: 'right' },
    { text: 'משתתפים: #participants', alignment: 'right' },
    { text: 'לוז אירועים:', alignment: 'right' },
    { text: '#schedul', alignment: 'right' },
    { text: 'אחת שתיים ^ שלוש ארבע ^ חמש', alignment: 'right' },
  ],
}

let variables = {
  event_date: '25.5.2022',
  participants: '1,000',
  schedul: 'ראשון שני שלישי ^ רביעי',
}

const replate_str = (str, to, index) => {
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
        str[word] = replate_str(')', ch)
        last_change_ch = ch
        last_change_word = word
      } else if (str[word][ch] == ')') {
        str[word] = replate_str('(', ch)
        last_change_ch = ch
        last_change_word = word
      }
    }
  }
  str = replace_to_br(str)
  return str.reverse().join(' ')
}

const conc_variable = (find, replace) => {
  pdf_content = JSON.stringify(pdf_content)
  pdf_content = pdf_content.replace(new RegExp(find, 'g'), replace)

  pdf_content = JSON.parse(pdf_content)
}

const conc_variables = () => {
  for (let [key, value] of Object.entries(variables)) {
    conc_variable('#' + key, value)
  }
}

conc_variables(variables)

if (lang.toLowerCase() == 'hebrew') {
  for (i in pdf_content['content']) {
    var pdf_text = pdf_content['content'][i]['text']
    pdf_content['content'][i]['text'] = str_to_he(pdf_text)
  }
}

var printer = new pdfmake(fonts)
var pdfDoc = printer.createPdfKitDocument(pdf_content)
pdfDoc.pipe(fs.createWriteStream('./utils/edit_pdf/result.pdf'))
pdfDoc.end()

fs.writeFile('./utils/edit_pdf/pdf_data.txt', 'Content field: \n' + JSON.stringify(pdf_content) + '\n fields field: \n' + JSON.stringify(variables), (err) => {
  if (err) {
    return console.log(err)
  }
})

module.exports = {}
