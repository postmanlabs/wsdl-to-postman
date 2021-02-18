const expect = require('chai').expect,
  {
    validate
  } = require('../../index'),
  fs = require('fs');

describe('Test validate function in SchemaPack', function() {
  
  it('Should get an error msg when there is no WSDL spec', function () {
    try {
      const data = fs.readFileSync('test/data/empty.wsdl', 'utf8')
      console.log(data)

    } catch (err) {
      console.error(err)
    }
  });

  it('Should be successful when input contains "definitions>"', function() {
    //fs.readFileSync('test/data/Simple.wsdl');
    try {
      const data = fs.readFileSync('test/data/Simple.wsdl', 'utf8');
      console.log(data);
      let result = validate(data);
      expect(result).to.be.an('object')
      .and.to.include({
        result: true,
        reason: 'Success'
    });
    } catch (err) {
      console.error(err)
    }
  });
  
});
