const POST_METHOD = 'POST',
  GET_METHOD = 'GET',

  /**
   *
   * @description Takes in a string and returns a constant verb
   *
   * @param {string} stringVerb RequestList
   * @returns {string} validation
   */
  getHttpVerb = (stringVerb) => {
    var verbs = {
      'get': GET_METHOD,
      'post': POST_METHOD,
      'default': POST_METHOD
    };
    return (verbs[stringVerb.toLowerCase()] || verbs.default);
  };

module.exports = {
  getHttpVerb,
  GET_METHOD,
  POST_METHOD
};
