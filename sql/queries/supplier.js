const create_supplier = (details) => {
  return `
  INSERT INTO supplier (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_supplier_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM supplier WHERE uuid = '${uuid}';`
}

const get_suppliers = ({ search, limit, offset }) => {
  return `
  SELECT *
  FROM supplier
  ${search ? `WHERE email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%'` : ''}
    LIMIT ${limit} OFFSET ${offset}
    ;`
}

const get_sum_rows = ({ search }) => {
  return `
    SELECT 
    COUNT(DISTINCT id) AS sum
    FROM supplier 
    ${search ? `WHERE  email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%' ` : ''}
    ;`
}

const update_supplier = (supplier, uuid) => {
  return `
  UPDATE supplier 
  SET ${Object.keys(supplier).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_supplier = (uuid) => {
  return `
  DELETE FROM supplier WHERE uuid = '${uuid}'; 
  `
}

module.exports = {
  create_supplier,
  get_supplier_by_uuid,
  get_suppliers,
  update_supplier,
  delete_supplier,
  get_sum_rows,
}
