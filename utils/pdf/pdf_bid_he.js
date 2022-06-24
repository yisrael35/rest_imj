const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const Logger = require('logplease')
const logger = Logger.create('utils/pdf/pdf_bid_en.js')

const moment = require('moment')

const black = '#1A1A1A'
const grey = '#6C7678'
const green = '#00C12D'
const red = '#EB0000'
const orange = '#EB5E00'
// pending: '#F4BF2D'//yellow,
// settled: '#00D4BE',//light blue
// processing: '#5A74FF',//blue
// cancelled: '#EB0000',//red
// validated: '#00C12D',//green
// rejected: '#EB5E00',//orange
// created: '#00B0E4'//light blue
const regular_font = 'OpenSansHebrew-Regular'
const bold_font = 'OpenSansHebrew-Bold'

const create_pdf = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file_name = `he_pdf_${Date.now()}.pdf`
      let file_path = path.join(path.resolve(), 'files', file_name)

      const doc = new PDFDocument({ margin: 50 })
      doc.font(path.join(path.resolve(), 'utils', 'pdf', 'edit_pdf', 'Open Sans Hebrew', 'OpenSansHebrew-Regular.ttf'))
      doc.font(path.join(path.resolve(), 'utils', 'pdf', 'edit_pdf', 'Open Sans Hebrew', 'OpenSansHebrew-Bold.ttf'))

      doc.pipe(fs.createWriteStream(file_path))
      await concat_data(doc, data)
      return resolve({ status: 200, file_name })
    } catch (error) {
      logger.error(error)
      return reject({ message: 'failed to create pdf file' })
    }
  })
}

const str_to_hebrew = (str) => {
  str = ' ' + str
  return str.split(/(\s+)/).reverse().join('')
}

const concat_data = async (doc, data) => {
  await generate_header(doc, data)
  await generate_bid_data(doc, data)
  await generate_bottom(doc)
  doc.end()
}

const generate_header = (doc, data) => {
  const { event_name } = data

  doc.image(path.join(path.resolve(), 'utils', 'pdf', 'logo_he.png'), 250, 52, { width: 290, height: 57 }).moveDown()
  doc.strokeColor(black).lineWidth(1).moveTo(50, 125).lineTo(550, 125).stroke().moveDown()
  doc
    .fontSize(17)
    .fillColor(grey)
    .text('הצעת מחיר לאירוע ', 0, 165, { align: 'right', width: 400, features: ['rtla'] })
    .text(event_name, 0, 165, { align: 'right', width: 260, features: ['rtla'] })
    .moveDown()
}

const generate_bid_data = (doc, data) => {
  const { uuid, participants, currency, price, status, event_date, client_name, user_name, location_name } = data

  let x_key = 550
  let x_value = 460
  let y = 225
  let add_to_y = 27
  const field_font = bold_font
  const value_font = regular_font
  let status_color = green
  let status_he

  if (status === 'approved') {
    status_he = 'מאושרת'
    status_color = green
  } else if (status === 'sent') {
    status_he = 'נשלחה'
    status_color = orange
  } else if (status === 'draft') {
    status_he = 'טיוטה'
    status_color = grey
  }
  doc
    .fillColor(black)
    .fontSize(13)
    .font(value_font)
    .text(`מצב ההצעה`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .fillColor(status_color)
    .font(field_font)
    .text(status_he, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y += add_to_y
  doc
    .fillColor(black)
    .font(value_font)
    .text(`תאריך האירוע`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${moment(event_date).format('DD-MM-YYYY')}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y += add_to_y
  doc
    .fillColor(black)
    .font(value_font)
    .text(`מיקום`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${location_name}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y += add_to_y
  doc
    .fillColor(black)
    .font(value_font)
    .text(`כמות משתתפים`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${participants}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y += add_to_y
  doc.font(value_font).text(`מזהה מערכת`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${uuid}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  // //second column
  x_key = 250
  x_value = 160
  y = 225

  doc.font(value_font).text(`מחיר סופי`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${String(price)}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y += add_to_y
  doc.font(value_font).text(`סוג מטבע`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${currency}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y += add_to_y
  doc.font(value_font).text(`שם לקוח`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${client_name}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y += add_to_y
  doc.font(value_font).text(`אחראי מהמוזיאון`, 0, y, { align: 'right', width: x_key, features: ['rtla'] })
  doc
    .font(field_font)
    .text(`${user_name}`, 0, y, { align: 'right', width: x_value, features: ['rtla'] })
    .moveDown()

  y = 390
  x_value = 360

  doc
    .font(regular_font)
    .fontSize(14)
    .fillColor(grey)
    .text(`שם מבצע העסקה הוא:`, 0, y, { align: 'right', width: 550, features: ['rtla'] })
  doc
    .font(bold_font)
    .fillColor(black)
    .text(`${client_name}`, 0, y, { align: 'right', width: 418, features: ['rtla'] })
    .moveDown()
    .moveDown()
}

const generate_bottom = (doc) => {
  x = 550
  y = 460
  add_to_y = 15
  doc
    .fontSize(11)
    .fillColor(black)
    .font(bold_font)
    .text('מוזיאון ישראל', 0, y, { align: 'right', width: x, features: ['rtla'] })
    .fontSize(10)
    .font(regular_font)
    .text('שדרות רופין 11 הקריה, ירושלים', 0, y + add_to_y, { align: 'right', width: x, features: ['rtla'] })
    .text('טל: 02-6708811  |  li.gro.jmi@ofni', 0, y + 2 * add_to_y, { align: 'right', width: x, features: ['rtla'] })
    .text('https://www.imj.org.il', 0, y + 3 * add_to_y, { align: 'right', width: x, features: ['rtla'] })
    .moveDown()
    .moveDown()

  x = 550
  y = 570
  add_to_y = 15

  doc
    .fontSize(11)
    .fillColor(grey)
    .font(bold_font)
    .text(`כתב ויתור`, 0, y, { align: 'right', width: x, features: ['rtla'] })
    .moveDown()
    .fontSize(10)
    .font(regular_font)
    .text(`הצעה זו נכתבה על ידי מוזיאון ישראל, ירושלים.`, 0, y + 1.75 * add_to_y, { align: 'right', width: x, features: ['rtla'] })
    .text(`לכל שאלה בנוגע להצעה זו, אנא פנו לצוות התמיכה שלנו.`, 0, y + 2.7 * add_to_y, { align: 'right', width: x, features: ['rtla'] })
    .text(`תוכן הצעה זו הינו חסוי ומיועד אך ורק לשימוש האדם שאליו הוא מיועד.`, 0, y + 4 * add_to_y, { align: 'right', width: x, features: ['rtla'] })
    .text(`כל הכתוב ומוצע בקובץ זה בתחום אחריותו של נותן ההצעה מטעם המוזיאון ואינו מייצג בהכרח את התעריפים של מוזיאון ישראל, ירושלים.`, 0, y + 5 * add_to_y, {
      align: 'right',
      width: x,
      features: ['rtla'],
    })
    .text(`אם אינך הנמענ/ת המיועד/ת של דוא"ל זה,`, 0, y + 6.3 * add_to_y, {
      align: 'right',
      width: x,
      features: ['rtla'],
    })
    .moveDown()
    .text(`אינך מורשה/ת לנקוט בפעולה כלשהי על סמך תוכנו, לא להעתיק או להראות את התוכן לאף גורם נוסף ועליו להימחק מיידית ממחשבך.`, 0, y + 7.3 * add_to_y, {
      align: 'right',
      width: x,
      features: ['rtla'],
    })
    .moveDown()
}

module.exports = { create_pdf }
