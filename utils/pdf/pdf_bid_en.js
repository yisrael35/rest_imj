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
const regular_font = 'WorkSans-Regular'
const bold_font = 'WorkSans-Bold'

const create_pdf = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file_name = `en_pdf_${Date.now()}.pdf`
      let file_path = path.join(path.resolve(), 'files', file_name)

      const doc = new PDFDocument({ margin: 50 })
      doc.font(path.join(path.resolve(), 'utils', 'pdf', 'Work_Sans', 'static', 'WorkSans-Bold.ttf'))
      doc.font(path.join(path.resolve(), 'utils', 'pdf', 'Work_Sans', 'static', 'WorkSans-Regular.ttf'))

      doc.pipe(fs.createWriteStream(file_path))
      await concat_data(doc, data)
      return resolve({ status: 200, file_name })
    } catch (error) {
      logger.error(error)
      return reject({ message: 'failed to create pdf file' })
    }
  })
}

const concat_data = async (doc, data) => {
  await generate_header(doc, data)
  await generate_bid_data(doc, data)
  await generate_bottom(doc)
  doc.end()
}

const generate_header = (doc, data) => {
  const { event_name } = data

  doc.image(path.join(path.resolve(), 'utils', 'pdf', 'logo.png'), 50, 45, { width: 300, height: 100 }).moveDown()
  doc.strokeColor(black).lineWidth(1).moveTo(50, 125).lineTo(550, 125).stroke().moveDown()
  doc
    .fontSize(16)
    .fillColor(grey)
    .text(event_name.charAt(0).toUpperCase() + event_name.slice(1).toLowerCase() + ' Bid Information', 220, 150)
    .moveDown()
}
const generate_bid_data = (doc, data) => {
  const { uuid, participants, currency, price, status, event_date, client_name, user_name, location_name } = data

  let x_key = 50
  let x_value = 150
  let y = 190
  let add_to_y = 28
  const field_font = bold_font
  const value_font = regular_font
  let status_color = green

  if (status === 'approved') {
    status_color = green
  } else if (status === 'sent') {
    status_color = orange
  } else if (status === 'draft') {
    status_color = grey
  }
  doc.fillColor(black).fontSize(12).font(value_font).text(`Status `, x_key, y)
  const status_title = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  doc.fillColor(status_color).font(field_font).text(`${status_title}`, x_value, y).moveDown()

  y += add_to_y
  doc.fillColor(black).font(value_font).text(`Event Date `, x_key)
  doc
    .font(field_font)
    .text(`${moment(event_date).format('YYYY-MM-DD')}`, x_value, y)
    .moveDown()

  y += add_to_y
  doc.fillColor(black).font(value_font).text(`Location `, x_key, y)
  doc.font(field_font).text(`${location_name}`, x_value, y).moveDown()

  y += add_to_y
  doc.fillColor(black).font(value_font).text(`Participants `, x_key, y)
  doc.font(field_font).text(`${participants}`, x_value, y).moveDown()

  y += add_to_y
  doc.font(value_font).text(`ID `, x_key, y)
  doc.font(field_font).text(`${uuid}`, x_value, y).moveDown()

  // //second column
  x_key = 350
  x_value = 480
  y = 190

  doc.font(value_font).text(`Total Price `, x_key, y)
  doc
    .font(field_font)
    .text(`${String(price)}`, x_value, y)
    .moveDown()

  y += add_to_y
  doc.font(value_font).text(`Currency `, x_key, y)
  doc.font(field_font).text(`${currency}`, x_value, y).moveDown()

  y += add_to_y
  doc.font(value_font).text(`Client Name `, x_key, y)
  doc.font(field_font).text(`${client_name}`, x_value, y).moveDown()

  y += add_to_y
  doc.font(value_font).text(`Museum Employee `, x_key, y)
  doc.font(field_font).text(`${user_name}`, x_value, y).moveDown()

  y = 390
  x_value = 360

  doc.font(regular_font).fontSize(14).fillColor(grey).text(`The Beneficial Owners of this transaction is:`, 50, y)
  doc.font(bold_font).fillColor(black).text(`${client_name}`, x_value, y).moveDown().moveDown()
}

const generate_bottom = (doc) => {
  y = 460
  doc
    .fontSize(11)
    .fillColor(black)
    .font(bold_font)
    .text('Israel Museum Jerusalem', 50, y)
    .fontSize(10)
    .font(regular_font)
    .text('Derech Ruppin 11')
    .text('Jerusalem, Israel')
    .text('Tel: 02-6708811  |  info@imj.org.il')
    .text('https://www.imj.org.il/en')
    .moveDown()
    .moveDown()

  doc
    .fontSize(11)
    .fillColor(grey)
    .font(bold_font)
    .text(`Disclaimer`, 50, y + 90)
    .moveDown()
    .fontSize(10)
    .font(regular_font)
    .text(
      `The bid has been arranged by Israel Museum Jerusalem.
For any questions regarding this bid, please contact us.`
    )
    .text(
      `
This bid attachment is confidential and are intended solely for the use of the individual to whom it is addressed. 
Any views or opinions expressed are solely those of the author and do not necessarily represent those of Israel Museum Jerusalem.

If you are not the intended recipient of this email, you must neither take any action based upon its contents, nor copy or show it to anyone.

Please contact Israel Museum Jerusalem if you believe you have received this email in error.`
    )
    .moveDown()
}

module.exports = { create_pdf }
