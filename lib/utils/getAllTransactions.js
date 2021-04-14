/**
 * Extract all transaction from collection and appends them into array
 *
 * @param {*} collection - Postman Collection
 * @param {*} allRequests - Array to which transactions are appended
 * @returns {*} - null
 */
function getAllTransactions(collection, allRequests) {
  if (!collection.item || !collection.item instanceof Array) {
    return [];
  }
  collection.item.forEach((item) => {

    if (item.request || item.response) {
      allRequests.push(item);
    }
    else {
      getAllTransactions(item, allRequests);
    }
  });
  return allRequests;
}

module.exports = {
  getAllTransactions
};
