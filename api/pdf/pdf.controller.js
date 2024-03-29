const Logger = require('logplease')
const logger = Logger.create('pdf.controller.js')
const pdf_service = require('./pdf.service')
const query = require('../../sql/queries/pdf')
const db_helper = require('../../utils/db_helper')
const { validateEmail } = require('../../utils/helper')

const create_pdf = async (req, res) => {
  try {
    const process_data = await process_payload(req.body)
    const { bid_id: bid_uuid } = req.body
    const { bid_id, event_id, email } = process_data
    let event_type_id, fields
    if (bid_id) {
      const [res_bid] = await db_helper.get(query.get_bid_by_id(bid_id))
      if (!res_bid) {
        return res.status(404).end()
      }

      // NOTE- in case bid status fields = draft
      // if (res_bid['status'] === 'draft') {
      //   return res.status(400).send('Check bid status.')
      // }

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

    pdf_service.create_pdf({ event_type_id, fields, email, bid_uuid }, res)
  } catch (error) {
    logger.error(error)
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
    logger.error(error)
    return res.status(400).end()
  }
}

const get_fields = async (event_type_id, res_bid) => {
  const [res_event_type] = await db_helper.get(query.get_event_type(event_type_id))
  if (!res_event_type) {
    logger.error('res_event_type failed')
    throw Error
  }
  const [res_user] = await db_helper.get(query.get_user(res_bid.user_id))
  if (!res_user) {
    logger.error('res_user failed')
    throw Error
  }
  let fields = ['language', 'event_type', 'currency', 'location_name', 'event_date', 'client_id', 'event_name', 'status']
  const process_data = {}
  for (const key of fields) {
    //  handle multiple tables
    switch (key) {
      case 'language':
        process_data[key] = res_bid['language']
        break
      case 'event_type':
        process_data[key] = res_event_type['name']
        break
      case 'currency':
        currency = res_bid['currency']
        break
      case 'location_name':

        const [res_location] = await db_helper.get(query.get_location_by_id(res_bid['location_id']))
        if (!res_location) {
          logger.error('res_location failed')
          throw Error
        }
        if (res_bid['language'].toLowerCase() === 'he') {
          process_data['location_name'] = res_location['name_he']
        } else if (res_bid['language'].toLowerCase() === 'en') {
          process_data['location_name'] = res_location['name_en']
        }
        break
      case 'event_date':
        let date
        if (res_bid['language'] == 'en') {
          date = res_bid['event_date'].getUTCFullYear() + (res_bid['event_date'].getUTCMonth() + 1 + res_bid['event_date'].getUTCDate()) + '/'
        } else {
          date = res_bid['event_date'].getUTCDate() + '/' + (res_bid['event_date'].getUTCMonth() + 1) + '/' + res_bid['event_date'].getUTCFullYear()
        }
        process_data['date'] = date
        break
      case 'client_id':
        const [res_client] = await db_helper.get(query.get_table_by_id('client', res_bid[key]))
        if (!res_client) {
          logger.error('res_client failed')
          throw Error
        }
        process_data[key] = res_client['name']
        process_data['client_name'] = res_client['name']

        break
      // case 'event_comment':
      //   process_data[key] = res_bid['comment']
      //   break

      default:
        if (res_bid[key]) {
          process_data[key] = res_bid[key]
        } else {
          process_data[key] = ''
        }
        break
    }
  }

  process_data['schedule_event'] = await get_schedule_event(res_bid['id'], process_data['language'])
  let costs = await get_costs(res_bid['id'], process_data['language'])
  process_data['costs'] = costs.cost_str
  process_data['price'] = String(costs.total_cost)
  process_data['uuid'] = res_bid.uuid
  process_data['uuid'] = res_bid.uuid
  process_data['participants'] = res_bid.max_participants.toString()
  process_data['user_name'] = res_user.first_name + ' ' + res_user.last_name
  process_data['currency'] = res_bid.currency.toUpperCase()
  return process_data
}

const get_costs = async (bid_id, lang) => {
  const res_cost = await db_helper.get(query.get_cost_by_bid_id(bid_id))
  let total_cost = 0
  if (!res_cost) {
    logger.error('res_cost failed')
    throw Error
  }
  if (res_cost.length === 0 || (res_cost[0]['description'] == '' && res_cost[0]['amount'] == 0 && res_cost[0]['total_cost'] == 0)) {
    return { cost_str: '', total_cost: '0' }
  }
  let cost_str = '',
    price_with_discount = ''
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
    // if (discount_flag) {
    //   cost_str += '^ סך הכל לפני הנחה: ' + total_cost + '^ סך הכל אחרי הנחה: ' + total_cost_with_discount
    // } else {
    //   cost_str += '^ סך הכל: ' + total_cost
    // }
  } else {
    for (let element of res_cost) {
      cost_str += element['description'] + ': ' + element['amount'] + ' x ' + ' ' + element['unit_cost']
      let discount = 0
      if (element['discount']) {
        cost_str += ' -' + element['discount']
        discount = element['discount']
        discount_flag = true
      }
      cost_str += ' = ' + (element['total_cost'] - discount) + ' ' + element['comment'] + '\\n'
      price_with_discount = element['total_cost'] - discount
      total_cost += price_with_discount
    }
    // if (discount_flag) {
    //   cost_str += '\\ntotal price without discount: ' + total_cost + '\\n total price with discount: ' + total_cost_with_discount
    // } else {
    //   cost_str += '\\ntotal price: ' + total_cost
    // }
  }
  total_cost = String(total_cost)
  return { cost_str, total_cost }
}
const get_schedule_event = async (bid_id, lang) => {
  const res_schedule_event = await db_helper.get(query.get_schedule_event_by_bid_id(bid_id))
  if (!res_schedule_event) {
    logger.error('res_schedule_event failed')
    throw Error
  }
  if (res_schedule_event.length === 0 || (res_schedule_event[0]['start_activity'] == '00:00:00' && res_schedule_event[0]['end_activity'] == '00:00:00')) {
    return ''
  }
  let schedule_str = ''
  if (lang.toLowerCase() == 'hebrew') {
    for (let element of res_schedule_event) {
      schedule_str += element['end_activity'].slice(0, 5) + ' - ' + element['start_activity'].slice(0, 5) + '  ' + element['description'] + '^'
    }
    schedule_str = schedule_str.slice(0, -1)
  } else {
    for (let element of res_schedule_event) {
      schedule_str += element['start_activity'].slice(0, 5) + ' - ' + element['end_activity'].slice(0, 5) + '  ' + element['description'] + '\\n'
    }
  }

  return schedule_str
}

const process_payload = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'bid_id':
              const [res_bid] = await db_helper.get(query.get_bid_id_by_uuid(val.trim()))
              if (!res_bid) {
                return reject({ status: 404 })
              }
              processed_payload.bid_id = res_bid.id
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
      return reject({ status: 400 })
    }
  })
}

module.exports = {
  create_pdf,
  delete_pdf,
}
