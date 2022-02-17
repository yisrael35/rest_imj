const Logger = require('logplease')
const logger = Logger.create('pdf.controller.js')
const pdf_service = require('./pdf.service')
const query = require('../../sql/queries/pdf')
const db_helper = require('../../utils/db_helper')
const { validateEmail } = require('../../utils/helper')

const create_pdf = async (req, res) => {
  try {
    const process_data = await process_payload(req.body)
    const { bid_id, event_id, email } = process_data
    let event_type_id, fields
    if (bid_id) {
      const [res_bid] = await db_helper.get(query.get_bid_by_id(bid_id))
      if (!res_bid) {
        return res.status(404).end()
      }
      event_type_id = res_bid.event_type_id

      fields = await get_fields(event_type_id, res_bid)
    }
    // if (event_id) {
    //   const [res_event] = await db_helper.get(query.get_event_id_by_uuid(event_id))
    //   if (!res_event) {
    //     return res.status(404).end()
    //   }
    //   event_type_id = res_event.event_type_id
    //   fields = await get_fields(event_id, res_event)
    // }

    pdf_service.create_pdf({ event_type_id, fields, email }, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const delete_pdf = async (req, res) => {
  try {
    const file_name = req.params.id
    if (!file_name) {
      return res.status(400).end()
    }
    pdf_service.delete_pdf(file_name, res)
  } catch (error) {
    return res.status(400).end()
  }
}

const get_fields = async (event_type_id, res_bid) => {
  // console.log(res_bid)
  const [res_event_type] = await db_helper.get(query.get_event_type(event_type_id))
  if (!res_event_type) {
    logger.error('res_event_type failed')
    throw Error
  }
  let fields = JSON.parse(res_event_type.fields)
  const process_data = {}
  for (const [key, val] of Object.entries(fields)) {
    // TODO : handle multiple tables
    switch (key) {
      case 'language':
        process_data[key] = res_event_type['language']
        break
      case 'event_type':
        process_data[key] = res_event_type['name']
        break
      case 'currency':
        currency = res_bid['currency']
        break
      case 'location_name':
        // join implementation:
        // process_data['location_name'] = res_event_type['language'].toLowerCase() === 'hebrew' ? res_bid?.location_he : res_bid?.location_en

        const [res_location] = await db_helper.get(query.get_location_by_id(res_bid['location_id']))
        if (!res_location) {
          logger.error('res_location failed')
          throw Error
        }
        if (res_event_type['language'].toLowerCase() === 'hebrew') {
          process_data['location_name'] = res_location['name_he']
        } else if (res_event_type['language'].toLowerCase() === 'english') {
          process_data['location_name'] = res_location['name_en']
        } 
        break
      case 'event_date':
        let date = res_bid['event_date'].getUTCDate() + '/' + (res_bid['event_date'].getUTCMonth() + 1) + '/' + res_bid['event_date'].getUTCFullYear()
        process_data[key] = date
        break
      case 'client_id':
        const [res_client] = await db_helper.get(query.get_table_by_id('client', res_bid[key]))
        if (!res_client) {
          logger.error('res_client failed')
          throw Error
        }
        process_data[key] = res_client['name']
        break
      case 'event_comment':
        process_data[key] = res_bid['comment']
        break

      default:
        if (res_bid[key]) {
          process_data[key] = res_bid[key]
        } else {
          process_data[key] = key
        }
        break
    }
  }

  process_data['schedule_event'] = await get_schedule_event(res_bid['id'], process_data['language'])
  process_data['costs'] = await get_costs(res_bid['id'], process_data['language'], process_data['total_b_discount'], process_data['total_a_discount'])

  // console.log('process_data:')
  // console.log(process_data)

  return process_data
}

const get_costs = async (bid_id, lang, total_cost, total_cost_with_discount) => {
  const res_cost = await db_helper.get(query.get_cost_by_bid_id(bid_id))
  if (!res_cost) {
    logger.error('res_cost failed')
    throw Error
  }
  let cost_str = ''
  let discount_flag = false
  if (lang.toLowerCase() == 'hebrew') {
    for (let element of res_cost) {
      cost_str += element['description'] + ': '
      if (element['discount']) {
        discount_flag = true
        let discount = element['discount']
        cost_str += element['total_cost'] - discount + ' = ' + element['discount'] + ' - '
      } else {
        cost_str += element['total_cost'] + ' = '
      }
      cost_str += element['unit_cost'] + ' x ' + element['amount'] + '  ' + element['comment'] + '^'
    }
    if (discount_flag) {
      cost_str += '^ סך הכל לפני הנחה: ' + total_cost + '^ סך הכל אחרי הנחה: ' + total_cost_with_discount
    } else {
      cost_str += '^ סך הכל: ' + total_cost
    }
  } else {
    for (let element of res_cost) {
      cost_str += element['description'] + ': ' + element['amount'] + ' x ' + ' ' + element['unit_cost']
      let discount = 0
      if (element['discount']) {
        cost_str += ' -' + element['discount']
        discount = element['discount']
      }
      cost_str += ' = ' + element['total_cost'] - discount + element['comment'] + '^'
    }
  }
  return cost_str
}
const get_schedule_event = async (bid_id, lang) => {
  const res_schedule_event = await db_helper.get(query.get_schedule_event_by_bid_id(bid_id))
  if (!res_schedule_event) {
    logger.error('res_schedule_event failed')
    throw Error
  }
  let schedule_str = ''

  if (lang.toLowerCase() == 'hebrew') {
    for (let element of res_schedule_event) {
      schedule_str += element['end_activity'].slice(0, 5) + ' - ' + element['start_activity'].slice(0, 5) + '  ' + element['description'] + '^'
    }
  } else {
    for (let element of res_schedule_event) {
      schedule_str += element['start_activity'].slice(0, 5) + ' - ' + element['end_activity'].slice(0, 5) + '  ' + element['description'] + '^'
    }
  }

  return schedule_str.slice(0, -1)
}

// costs
// currency
// end_time
// language
// event_date
// event_name
// event_type
// start_time
// client_name
// location_name
// imj_comments
// event_comment
// schedule_event
// total_discount
// max_participants
// min_participants
// total_a_discount
// total_b_discount

const process_payload = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'bid_id':
              processed_payload.bid_id = Number(val)
              break
            case 'event_id':
              processed_payload.event_id = val.trim()
              break
            case 'email':
              if (!validateEmail(val)) {
                return reject({ status: 400 })
              }
              processed_payload.email = val.trim()
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process pdf payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

module.exports = {
  create_pdf,
  delete_pdf,
}
