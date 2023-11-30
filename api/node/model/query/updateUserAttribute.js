const updateUserAttribute = (interestedCategories, userid) => {
  return `UPDATE users SET categories = '${JSON.stringify(
    interestedCategories
  )}' WHERE id = ${userid}`;
};
module.exports.updateUserAttribute = updateUserAttribute;
