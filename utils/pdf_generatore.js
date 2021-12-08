const pdfmake = require('pdfmake')
const fs = require('fs')
const db_helper = require('./db_helper')
const query = require('../sql/queries/pdf_generator')
// const pdf_temp = require('./edit_pdf/pdf_editor')

const fonts = {
  Roboto: {
    normal: __dirname + '\\edit_pdf\\Open Sans Hebrew\\OpenSansHebrew-Regular.ttf',
    bold: __dirname + '\\edit_pdf\\Open Sans Hebrew\\OpenSansHebrew-Bold.ttf',
    italics: __dirname + '\\edit_pdf\\Open Sans Hebrew\\OpenSansHebrew-Italic.ttf',
    bolditalics: __dirname + '\\edit_pdf\\Open Sans Hebrew\\OpenSansHebrew-Bolditalic.ttf',
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

    if (typeof pdf_content != 'json') {
      pdf_content = JSON.parse(pdf_content)
    }

    let file_name = `${id}_${new Date().getTime()}.pdf`
    let pdf_path = `./files/${file_name}`
    let printer = new pdfmake(fonts)
    let pdfDoc = printer.createPdfKitDocument(pdf_content)
    pdfDoc.pipe(fs.createWriteStream(pdf_path))
    pdfDoc.end()
    return { status: 200, file_name }
  } catch (error) {
    console.log(error)
    return { status: 500 }
  }
}

module.exports = {
  pdf_generator,
}
