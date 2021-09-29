const expect = require('chai').expect,
  fs = require('fs');
getOptions = require('../../lib/utils/options').getOptions;


/**
 * Generates markdown table documentation of options from getOptions()
 *
 * @param {Object} options - options from getOptions()
 * @returns {String} - markdown table consisting documetation for options
 */
function generateOptionsDoc(options) {
  var doc = 'id|type|available options|default|description|usage\n|---|---|---|---|---|---|\n';
  options.forEach((option) => {
    var convertArrayToDoc = (array) => {
        if (!array) {
          return '-';
        }
        return array.reduce((acc, ele) => {
          return (!acc ? acc : acc + ', ') + ele;
        }, '');
      },
      defaultOption = option.default;
    (defaultOption === undefined) && (defaultOption = JSON.stringify(defaultOption));
    doc += `${option.id}|${option.type}|${convertArrayToDoc(option.availableOptions, true)}|` +
      `${defaultOption}|${option.description}|${convertArrayToDoc(option.usage)}\n`;
  });
  return doc;
}


describe('OPTIONS.md', function () {
  it('generates file', function () {
    const content = generateOptionsDoc(getOptions());
    fs.writeFileSync('OPTIONS.md', content);
  });

  it('must contain all details of options', function () {
    const optionsDoc = fs.readFileSync('OPTIONS.md', 'utf-8');
    expect(optionsDoc).to.eql(generateOptionsDoc(getOptions()));
  });
});
