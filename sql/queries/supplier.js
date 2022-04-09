const create_supplier = (details) => {
  return `
  INSERT INTO supplier (${Object.keys(details)})
  VALUES (${Object.values(details).map((u) => '?')});`
}

const get_supplier_by_uuid = (uuid) => {
  return `
  SELECT *
  FROM supplier WHERE uuid = '${uuid}' AND is_active = 1;`
}

const get_suppliers = ({ search, limit, offset }) => {
  return `
  SELECT *
  FROM supplier
  WHERE
  ${search ? ` email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%'  AND` : ''}
  is_active = 1
  LIMIT ${limit} OFFSET ${offset}
    ;`
}

const get_sum_rows = ({ search }) => {
  return `
    SELECT 
    COUNT(DISTINCT id) AS sum
    FROM supplier 
    WHERE
    ${search ? ` email LIKE '%${search}%'  OR phone LIKE '%${search}%'  OR name LIKE '%${search}%'  AND` : ''}
    is_active = 1    ;`
}

const update_supplier = (supplier, uuid) => {
  return `
  UPDATE supplier 
  SET ${Object.keys(supplier).map((key) => `${key} = ? `)}
  WHERE uuid = '${uuid}';`
}

const delete_supplier = (id) => {
  return `
  DELETE FROM supplier WHERE id = '${id}'; 
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
