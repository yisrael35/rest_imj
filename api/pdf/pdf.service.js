const fs = require('fs')
const db_helper = require('../../utils/db_helper')
const query = require('../../sql/queries/pdf')
const Logger = require('logplease')
const logger = Logger.create('./api/pdf/pdf.service.js')
const pdf_generator = require('../../utils/pdf_generator')
const mailUtil = require('../../utils/mail')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const path = require('path')
const helper = require('../../utils/helper')

const create_pdf = async ({ event_type_id, fields, email, bid_uuid }, result) => {
  try {
    const res_pdf = await pdf_generator.pdf_generator(event_type_id, fields)
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
              console.log(err)
              return result.status(500).end()
            } else {
              // update status bid to sent
              if (bid_uuid) {
                const bid_data = { status: 'sent' }
                await db_helper.update(query.update_bid(bid_data, bid_uuid), bid_data)
              }
              return result.status(200).send({ data: { email: helper.return_encrypt_email(email) } })
            }
          })
        } else {
          return result.status(200).send({ file_name })
        }
      } else {
        return result.status(res_pdf.status).end()
      }
    }, 4000)
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

const delete_pdf = async (file_name, result) => {
  try {
    let file_path = `../../files/${file_name}`
    fs.unlink(file_path)
    return result.status(200).end()
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}

module.exports = {
  create_pdf,
  delete_pdf,
}
