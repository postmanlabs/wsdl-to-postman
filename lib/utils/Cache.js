class Cache {

  constructor() {
    this.cache = {};
  }

  /**
  * Retrieves an element from the cache
  * @param {string} key element's key
  * @returns {object} undefined if not found.
  */
  getFromCache(key) {
    return this.cache[key];
  }

  /**
  * Adds an element in the cache
  * @param {string} key element's key
  * @param {object} elementToCache elementToAddToCache
  * @returns {undefined} nothing
  */
  addToCache(key, elementToCache) {
    if (!this.getFromCache(key)) {
      this.cache[key] = elementToCache;

    }
  }

  /**
  * Overrides an element in the cache
  * @param {string} key element's key
  * @param {object} elementToCache elementToAddToCache
  * @returns {undefined} nothing
  */
  addOverWriteCache(key, elementToCache) {
    this.cache[key] = elementToCache;
  }

}

module.exports = {
  Cache
};
