const expect = require('chai').expect,
  {
    URLEncodedParamsHelper
  } = require('../../lib/utils/URLEncodedParamsHelper'),
  FahrenheitToCelsiusHttpPostIn = require('../data/elementsToURLEncoded/FahrenheitToCelsiusHttpPostIn'),
  GeocodeAddressParsedHttpPostIn = require('../data/elementsToURLEncoded/GeocodeAddressParsedHttpPostIn');


describe('URLEncodedParamsHelper  constructor', function () {
  it('should get an object for the factory with empty input', function () {
    const helper = new URLEncodedParamsHelper();
    expect(helper).to.be.an('object');
  });
});

describe('URLEncodedParamsHelper convertInputToURLEncoded', function () {
  it('Should get a list for FahrenheitToCelsiusHttpPostIn', function () {
    const helper = new URLEncodedParamsHelper(),
      jsonObjectMessage = helper.convertInputToURLEncoded(FahrenheitToCelsiusHttpPostIn);
    expect(jsonObjectMessage).to.be.an('Array');
    expect(jsonObjectMessage.length).to.equal(1);
    expect(jsonObjectMessage[0].key).to.equal('Fahrenheit');
    expect(jsonObjectMessage[0].type).to.equal('text');
    expect(jsonObjectMessage[0].value).to.be.a('string');
  });

  it('Should get a list for GeocodeAddressParsedHttpPostIn', function () {
    const helper = new URLEncodedParamsHelper(),
      jsonObjectMessage = helper.convertInputToURLEncoded(GeocodeAddressParsedHttpPostIn);
    expect(jsonObjectMessage).to.be.an('Array');
    expect(jsonObjectMessage.length).to.equal(22);
    expect(jsonObjectMessage[0].key).to.equal('number');
    expect(jsonObjectMessage[0].type).to.equal('text');
    expect(jsonObjectMessage[0].value).to.be.a('string');
  });

  it('Should get an empty array for null parameter', function () {
    const helper = new URLEncodedParamsHelper(),
      jsonObjectMessage = helper.convertInputToURLEncoded(null);
    expect(jsonObjectMessage).to.be.an('Array');
    expect(jsonObjectMessage.length).to.equal(0);
  });

  it('Should get an empty array for undefined parameter', function () {
    const helper = new URLEncodedParamsHelper(),
      jsonObjectMessage = helper.convertInputToURLEncoded(undefined);
    expect(jsonObjectMessage).to.be.an('Array');
    expect(jsonObjectMessage.length).to.equal(0);
  });

});
