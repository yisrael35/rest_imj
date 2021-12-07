const fs = require('fs')
const Logger = require('logplease')
const logger = Logger.create('pdf.service.js')
const pdf_generatore = require('../../utils/pdf_generatore')
const mailUtil = require('../../utils/mail')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const path = require('path')

const create_pdf = async ({ event_type_id, fields, email }, result) => {
  try {
    const res_pdf = await pdf_generatore.pdf_generator(event_type_id, fields)
    await setTimeout(() => {
      if (res_pdf.status === 200) {
        const file_name = res_pdf.file_name
        if (email) {
          let file_path = path.join(path.resolve(), 'files', file_name)
          let attachment = fs.readFileSync(file_path).toString('base64')
          const msg = {
            to: email,
            from: `${process.env.IMJ_FROM}`,
            subject: 'IMJ',
            attachments: [
              {
                content: attachment,
                filename: file_name,
                type: 'application/pdf',
                disposition: 'attachment',
              },
            ],
            html: mailUtil.share_file(),
          }
          sgMail.send(msg, async (err, res) => {
            if (err) {
              return result.status(500).end()
            } else {
              return result.status(200).send({ status: 200, data: { email: helper.return_encrypt_email(email) } })
            }
          })
        }
        return result.status(200).send(file_name)
      } else {
        return result.status(res_pdf.status).end()
      }
    }, 1500)
  } catch (error) {
    logger.log(error)
    return result.status(400).end()
  }
}

const delete_pdf = async (file_name, result) => {
  try {
    let file_path = `../../files/${file_name}`
    fs.unlink(file_path)
    return result.status(200).end()
  } catch (error) {
    return result.status(404).end()
  }
}

module.exports = {
  create_pdf,
  delete_pdf,
}
