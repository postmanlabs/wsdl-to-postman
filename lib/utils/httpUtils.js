const _ = require('lodash'),
  POST_METHOD = 'POST',
  GET_METHOD = 'GET';

/**
 *
 * @description Takes in a string and returns a constant verb
 *
 * @param {string} stringVerb RequestList
 * @returns {string} validation
 */
function getHttpVerb(stringVerb) {
  var verbs = {
    'get': GET_METHOD,
    'post': POST_METHOD,
    'default': POST_METHOD
  };
  return (verbs[_.toLower(stringVerb)] || verbs.default);
}

module.exports = {
  getHttpVerb,
  GET_METHOD,
  POST_METHOD
};
