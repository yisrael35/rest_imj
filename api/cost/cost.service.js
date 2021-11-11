const query = require('../../sql/queries/cost')
const db_helper = require('../../utils/db_helper')
const Logger = require('logplease')
const logger = Logger.create('cost.service.js')

const create_cost = async (costs, { bid_id, event_id }, result) => {
  try {
    for (const cost of costs) {
      cost.bid_id = bid_id
      cost.event_id = event_id
      const res_costs = await db_helper.update(query.create_cost(cost), cost)
      if (!res_costs.affectedRows) {
        logger.error('res_costs -- error')
        return result.status(400).end()
      }
    }
    return result.status(200).end()
  } catch (error) {
    logger.log(error)
    return result.status(400).end()
  }
}

const get_cost = async (uuid, result) => {
  try {
    const cost_details = await db_helper.get(query.get_cost_by_uuid(uuid))
    if (!cost_details.length) {
      return result.status(404).end()
    }
    return result.status(200).send(cost_details[0])
  } catch (error) {
    logger.log(error)
    return result.status(404).end()
  }
}
const get_costs = async (result) => {
  try {
    const cost_details = await db_helper.get(query.get_costs())
    if (!cost_details) {
      return result.status(404).end()
    }
    return result.status(200).send(cost_details)
  } catch (error) {
    return result.status(404).end()
  }
}

const update_cost = async (payload, uuid, result) => {
  try {
    const res = await db_helper.update(query.update_cost(payload, uuid), payload)
    if (!res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(400).end()
  }
}

const delete_cost = async (uuid, result) => {
  try {
    const { err, res } = await db_helper.update_just_query(query.delete_cost(uuid))
    if (err || !res.affectedRows) {
      return result.status(404).end()
    }
    return result.status(200).end()
  } catch (error) {
    return result.status(404).end()
  }
}

module.exports = {
  create_cost,
  get_cost,
  get_costs,
  update_cost,
  delete_cost,
}
