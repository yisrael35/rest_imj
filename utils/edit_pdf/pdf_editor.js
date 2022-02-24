const pdfmake = require('pdfmake')
const fs = require('fs')
const Logger = require('logplease')
const logger = Logger.create('./utils/edit_pdf/pdf_editor.js')

const fonts = {
  Roboto: {
    normal: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Regular.ttf',
    bold: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Bold.ttf',
    italics: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Italic.ttf',
    bolditalics: __dirname + '\\Open Sans Hebrew\\OpenSansHebrew-Bolditalic.ttf',
  },
}

// let lang = 'Hebrew'
// let pdf_content = {
//   content: [
//     { text: 'הצעת מחיר לאירוע #event_type במוזיאון ישראל', style: 'header', fontSize: 18, alignment: 'center', bold: true },
//     { text: ' ', alignment: 'right' },
//     { text: '#client_id שלום רב, ', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: 'להלן מפורטים פרטי האירוע וכן הצעת מחיר מטעם המוזיאון: ', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: 'פרטים כללים: ', alignment: 'right', bold: true },
//     { text: 'תאריך האירוע: #event_date', alignment: 'right' },
//     { text: 'כמות משתתפים: #max_participants - #min_participants', alignment: 'right' },
//     { text: 'מיקום האירוע: #location_name', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: 'לוח זמנים לאירוע:', alignment: 'right', bold: true },
//     { text: '#schedule_event', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: 'עלויות:', alignment: 'right', bold: true },
//     { text: '#costs', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: 'הערות:', alignment: 'right', bold: true },
//     { text: '#comment', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: 'נשמח לסייע בכל שאלה ובקשה נוספת. ', alignment: 'right' },
//     { text: ' ', alignment: 'right' },
//     { text: 'בברכה, ', alignment: 'right' },
//     { text: 'צוות המוזיאון. ', alignment: 'right' },
//   ],
// }

let lang = 'English'
let pdf_content = {
  content: [
    { text: 'Israel Museum’s proposal for #event_type event', style: 'header', fontSize: 18, alignment: 'center', bold: true },
    { text: ' ' },
    { text: 'Dear #client_id, ' },
    { text: ' ' },
    { text: 'Please find the event details and the Museum’s proposal for the event:' },
    { text: ' ' },
    { text: 'General details:', bold: true },
    { text: 'Date: #event_date' },
    { text: 'Participants: #min_participants - #max_participants' },
    { text: 'Location in the museum: #location_name' },
    { text: ' ' },
    { text: 'Event schedule:', bold: true },
    { text: '#schedule_event'},
    { text: ' ' },
    { text: 'Costs:', bold: true },
    { text: '#costs' },
    { text: ' ' },
    { text: 'Comments:', bold: true },
    { text: '#comment' },
    { text: ' '},
    { text: ' ' },
    { text: 'Please feel free to contact us any time!' },
    { text: 'Looking forward to hearing from you. ' },
    { text: '  ' },
    { text: 'Kind regards, ' },
    { text: 'Israel Museum Jerusalem' },
  ],
}

let variables = {
  costs: '',
  language: '',
  event_type: '',
  location_name: '',
  user: '',
  event_date: '',
  client_id: '',
  event_name: '',
  comment: '',
  total_a_discount: '',
  total_b_discount: '',
  total_discount: '',
  currency: '',
  max_participants: '',
  min_participants: '',
  status: '',
  schedule_event: '',
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

// if (lang.toLowerCase() == 'hebrew') {c
//   for (i in pdf_content['content']) {
//     var pdf_text = pdf_content['content'][i]['text']
//     pdf_content['content'][i]['text'] = str_to_he(pdf_text)
//   }
// }

fs.writeFile('./utils/edit_pdf/pdf_data.txt', 'Content field: \n' + JSON.stringify(pdf_content) + '\n fields field: \n' + JSON.stringify(variables), (err) => {
  if (err) {
    return console.log(err)
  }
})

conc_variables(variables)

var printer = new pdfmake(fonts)
var pdfDoc = printer.createPdfKitDocument(pdf_content)
pdfDoc.pipe(fs.createWriteStream('./utils/edit_pdf/result.pdf'))
pdfDoc.end()
