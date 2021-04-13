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
  })
  return allRequests;
}


module.exports = {
  getAllTransactions
}
