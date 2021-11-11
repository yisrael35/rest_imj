const create_cost = (details) => {
  return `
  INSERT INTO cost (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_cost_by_uuid = (id) => {
  return `
  SELECT *
  FROM cost WHERE id = '${id}';`
}

const get_costs = () => {
  return `
  SELECT *
  FROM cost;`
}
const update_cost = (cost, id) => {
  return `
  UPDATE cost 
  SET ${Object.keys(cost).map((key) => `${key} = ? `)}
  WHERE id = '${id}';`
}

const delete_cost = (id) => {
  return `
  DELETE FROM cost
  WHERE id = '${id}';`
}

const get_bid_id_by_uuid = (uuid) => {
  return `
  SELECT id AS bid_id
  FROM bid WHERE uuid = '${uuid}';`
}
const get_event_id_by_uuid = (uuid) => {
  return `
  SELECT id AS event_id
  FROM event WHERE uuid = '${uuid}';`
}

module.exports = {
  create_cost,
  get_cost_by_uuid,
  get_bid_id_by_uuid,
  get_event_id_by_uuid,
  get_costs,
  update_cost,
  delete_cost,
}
