
/**
* Removes new line characters of a string
* @param {string} text the text to remove the new line characters
* @returns {string} the modified text
*/
removeLineBreak = (text) => {
  return text.replace(/(\r\n|\n|\r)/gm, '');
};
module.exports = {
  removeLineBreak
};
