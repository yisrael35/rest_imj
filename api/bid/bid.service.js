const query = require('../../sql/queries/bid')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('api/bid/bid.service.js')
const csv_generator = require('../../workers/csv_worker')

const create_bid = async (payload, result) => {
  try {
    const { bid, schedule_event, costs, language } = payload

    const res_bid = await db_helper.update(query.create_bid(bid), bid)
    let bid_id = res_bid.insertId
    if (!bid_id) {
      return result.status(400).end()
    }

    for (const sch_e of schedule_event) {
      sch_e.bid_id = bid_id
      const res_schedule_event = await db_helper.update(query.create_schedule_event(sch_e), sch_e)
      if (!res_schedule_event.affectedRows) {
        logger.error('res_schedule_event -- error')
        return result.status(400).end()
      }
    }
    for (const cost of costs) {
      cost.bid_id = bid_id
      const res_costs = await db_helper.update(query.create_costs(cost), cost)
      if (!res_costs.affectedRows) {
        logger.error('res_costs -- error')
        return result.status(400).end()
      }
    }

    const client = { name: bid.client_name }
    const res_client = await db_helper.update(query.create_client(client), client)
    if (!res_client.affectedRows) {
      logger.error('res_client -- error')
    }

    return result.status(200).send({ bid_id })
  } catch (error) {
    logger.error(error)
    return result.status(400).end()
  }
}

const get_bid = async (uuid, result) => {
  try {
    const [bid_details] = await db_helper.get(query.get_bid_by_uuid(uuid))
    const bid_costs_details = await db_helper.get(query.get_bid_costs(uuid))
    const bid_schedule_event_details = await db_helper.get(query.get_bid_schedule_event(uuid))
    if (!bid_details) {
      return result.status(404).end()
    }
    return result.status(200).send({ bid: bid_details, costs: bid_costs_details, schedule_event: bid_schedule_event_details })
  } catch (error) {
    logger.error(error)
    return result.status(404).end()
  }
}
const get_bids = async (filters, result) => {
  try {
    const bid_details = await db_helper.get(query.get_bids(filters))
    if (!bid_details) {
      return result.status(404).end()
    }
    if (filters.csv) {
      const res_csv = await csv_generator.create_csv_file(bid_details)
      if (res_csv.status === 200) {
        const file_name = res_csv.file_name
        return result.status(200).send({ file_name })
      } else {
        return result.status(res_csv.status).send("failed to create csv")
      }
    }

    const meta_data = await get_meta_data(filters)

    return result.status(200).send({ bids: bid_details, meta_data })
  } catch (error) {
    return result.status(404).end()
  }
}

const update_bid = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_bid(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
  }
}

const delete_bid = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_bid(uuid))
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(404).end()
  }
}

const get_meta_data = (filters) => {
  return new Promise(async (resolve, reject) => {
    let { limit, offset } = filters
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

module.exports = {
  create_bid,
  get_bid,
  get_bids,
  update_bid,
  delete_bid,
}
