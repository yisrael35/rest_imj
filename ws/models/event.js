// const { message_builder } = require('../helpers/message_handler')
const Logger = require('logplease')
const logger = Logger.create('ws/models/events.js')
const { message_builder } = require('../helpers/message_builder')
const get_events = (message, ws) => {
  try {
    //TODO -- replace my event list with real data
    ws.send(JSON.stringify(message_builder({ type: 'events', error: false, content: { events: myEventsList }, code: '200' })))
  } catch (error) {
    logger.error(error)
    return ws.send(JSON.stringify(message_builder({ type: 'events', error: true, content: message, code: '400' })))
  }
}
module.exports = { get_events }

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
