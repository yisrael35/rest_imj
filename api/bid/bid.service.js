const query = require('../../sql/queries/bid')
const db_helper = require('../../utils/db_helper')

const create_bid = async (payload, result) => {
  try {
    const { bid, schedule_event, costs, language } = payload

    const res_bid = await db_helper.update(query.create_bid(bid), bid)
    let bid_id = res_bid.insertId
    if (!bid_id) {
      return result.status(404).end()
    }
    for (const sch_e of schedule_event) {
      sch_e.bid_id = bid_id
      const res_schedule_event = await db_helper.update(query.create_schedule_event(sch_e), sch_e)
      if (!res_schedule_event.affectedRows) {
        console.log('res_schedule_event -- error')
        return result.status(400).end()
      }
    }
    for (const cost of costs) {
      cost.bid_id = bid_id
      const res_costs = await db_helper.update(query.create_costs(cost), cost)
      if (!res_costs.affectedRows) {
        console.log('res_costs -- error')
        return result.status(400).end()
      }
    }

    return result.status(200).end()
  } catch (error) {
    console.log(error)
    return result.status(400).end()
  }
}

const get_bid = async (uuid, result) => {
  try {
    const bid_details = await db_helper.get(query.get_bid_by_uuid(uuid))
    if (!bid_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(bid_details[0])
  } catch (error) {
    console.log(error)
    return result.status(404).end()
  }
}
const get_bids = async (result) => {
  try {
    const bid_details = await db_helper.get(query.get_bids())
    if (!bid_details) {
      return result.status(404).end()
    }
    return result.status(200).send(bid_details)
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

module.exports = {
  create_bid,
  get_bid,
  get_bids,
  update_bid,
  delete_bid,
}
