const getCreateTableQuery = () => {
  return `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        categories JSONB
      );
    `;
};

module.exports = {
  getCreateTableQuery,
};
