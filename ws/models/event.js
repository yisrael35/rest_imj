const Logger = require('logplease')
const logger = Logger.create('./ws/models/events.js')
const { message_builder } = require('../helpers/message_builder')
const db_helper = require('../../utils/db_helper')
const query = require('../../sql/queries/event')
const moment = require('moment')
const ws_service = require('../services/ws_service')
const session_manager = require('../helpers/session_manager')

const get_events = async (message, ws) => {
  try {
    let filters

    if (message && message.data) {
      filters = await process_filters(message.data)
    } else {
      filters = await process_filters({})
    }
    let session = session_manager.get_session(ws.id)

    session['events'] = filters
    session_manager.update_session(ws.id, session)

    const event_details = await db_helper.get(query.get_events(filters))
    const events = []
    for (const event of event_details) {
      events.push({
        title: event.name,
        start: event.from_date,
        end: event.to_date,
        bgColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      })
    }
    const meta_data = await get_meta_data(filters)

    ws.send(JSON.stringify(message_builder({ type: 'events', error: false, content: { events, meta_data }, code: '200' })))
  } catch (error) {
    logger.error(error)
    return ws.send(JSON.stringify(message_builder({ type: 'events', error: true, content: message, code: '400' })))
  }
}

const send_update_event_to_all = async () => {
  try {
    const wss = ws_service.get_wss_of_ws_service()
    for (const ws of wss.clients) {
      let session = session_manager.get_session(ws.id)
      const filters = session.events
      const event_details = await db_helper.get(query.get_events(filters))
      const events = []
      for (const event of event_details) {
        events.push({
          title: event.name,
          start: event.from_date,
          end: event.to_date,
          bgColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        })
      }
      ws.send(JSON.stringify(message_builder({ type: 'events', error: false, content: { events }, code: '200' })))
    }
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  get_events,
  send_update_event_to_all,
}

const get_meta_data = (filters) => {
  return new Promise(async (resolve, reject) => {
    let { limit, offset } = filters
    limit = limit ? limit : 30
    offset = offset ? offset : 30
    let [{ sum }] = await db_helper.get(query.get_sum_rows(filters))
    const meta_data = {
      sum_rows: sum,
      limit: limit,
      page: offset == 0 ? 1 : JSON.parse(Math.ceil(offset / limit)) + 1,
      sum_pages: Math.ceil(sum / limit),
    }
    return resolve(meta_data)
  })
}

const process_filters = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const processed_payload = {}
      for (const [key, val] of Object.entries(payload)) {
        if (val !== undefined) {
          switch (key) {
            case 'search':
              processed_payload.search = val.trim()
              break
            case 'from_date':
              processed_payload.from_date = moment(val).format('YYYY-MM-DD HH:mm:ss')
              break
            case 'to_date':
              processed_payload.to_date = moment(val).format('YYYY-MM-DD HH:mm:ss')
              break
            default:
              return reject({ status: 400 })
          }
        }
      }
      processed_payload.from_date = processed_payload.from_date ? processed_payload.from_date : moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
      processed_payload.to_date = processed_payload.to_date ? processed_payload.to_date : moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
      return resolve(processed_payload)
    } catch (error) {
      logger.error(`Failed to process event payload, The error: ${error}`)
      return reject({ status: 404, error: '4.11' })
    }
  })
}

const myEventsList = [
  {
    title: 'All Day Event very long title',
    color: '#ff7f50',
    allDay: true,
    start: '2022-01-03',
    end: '2022-01-03',
  },
  {
    title: 'Long Event',
    start: '2022-01-06',
    end: '2022-01-06',
  },
  {
    title: 'DTS STARTS',
    bgColor: '#dc143c',
    start: '2022-01-18',
    end: '2022-01-18',
  },

  {
    title: 'DTS ENDS',
    bgColor: '#ff8c00',
    start: '2022-02-16',
    end: '2022-02-16',
  },

  {
    title: 'Some Event',
    bgColor: '#9932cc',
    start: '2022-02-26',
    end: '2022-02-26',
  },
  {
    title: 'Conference',
    bgColor: '#e9967a',
    start: '2022-02-26',
    end: '2022-02-26',
    desc: 'Big conference for important people',
  },
  {
    title: 'Meeting',
    bgColor: '#8fbc8f',
    start: '2022-03-26',
    end: '2022-03-26',
    desc: 'Pre-meeting meeting, to prepare for the meeting',
  },
  {
    title: 'Lunch',
    bgColor: '#cd5c5c',
    start: '2022-01-26',
    end: '2022-01-26',
    desc: 'Power lunch',
  },
  {
    title: 'Happy Hour',
    start: '2022-02-13',
    end: '2022-02-13',
    desc: 'Power lunch happy hour',
  },
  {
    title: 'Meeting',
    bgColor: '#da70d6',
    start: '2022-02-12',
    end: '2022-02-12',
  },
]
