const userSelectQuery = (id) => {
  query = "select * from users where id = ";
  query += String(id);
  return query;
};

module.exports.userSelectQuery = userSelectQuery;
