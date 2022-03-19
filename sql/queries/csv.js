const get = (table, filters) => {
  const { from_date, to_date } = filters
  return `
  SELECT *
  FROM ${table}
  WHERE
  ${from_date ? `  '${from_date}' < created_at AND  '${to_date}' > created_at AND` : ''}
  1 = 1
  ;`
}

module.exports = {
  get,
}
