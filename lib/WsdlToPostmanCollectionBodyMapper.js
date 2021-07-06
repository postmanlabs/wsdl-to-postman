const XML = 'xml',
  {
    SOAPMessageHelper
  } = require('../lib/utils/SOAPMessageHelper'),
  {
    URLEncodedParamsHelper
  } = require('../lib/utils/URLEncodedParamsHelper'),
  {
    XMLMessageHelper
  } = require('../lib/utils/XMLMessageHelper'),
  {
    HTTP_PROTOCOL,
    SOAP_PROTOCOL,
    SOAP12_PROTOCOL,
    MIME_TYPE_XML,
    URL_ENCODED
  } = require('./constants/processConstants');

/**
 * Class to map a json parsed WSDL object to a PostmanCollection object
 * @param {object} wsdlObject Contains parsed data from a xml document to json format
 */
class WsdlToPostmanCollectionBodyMapper {

  /**
  * Generates the request's body for the sent operation
  * depending on operation protocol
  * @param {object} operation the operation to generate the request's body
  * @param {*} elementToCreateBody the root node for the message parameters
  * @param {array} securityPolicyArray An array with all security policies
  * @param {object} xmlParser the parser class to parse xml to object or vice versa
  * @returns {array} An array with all items generated in postman item definition format
  */
  getBody(operation, elementToCreateBody, securityPolicyArray, xmlParser) {
    if (operation.protocol === SOAP_PROTOCOL ||
      operation.protocol === SOAP12_PROTOCOL) {
      return this.createBodyForSOAP(operation, elementToCreateBody, securityPolicyArray, xmlParser);
    }
    if (operation.protocol === HTTP_PROTOCOL) {
      return this.createBodyForHTTP(operation, elementToCreateBody, securityPolicyArray, true, xmlParser);
    }
  }

  /**
  * Generates the request's body for the sent operation
  * depending on operation protocol
  * @param {object} operation the operation to generate the request's body
  * @param {*} elementToCreateBody the root node for the message parameters
  * @param {array} securityPolicyArray An array with all security policies
  * @param {object} xmlParser the parser class to parse xml to object or vice versa
  * @returns {array} An array with all items generated in postman item definition format
  */
  getResponseBody(operation, elementToCreateBody, securityPolicyArray, xmlParser) {
    if (operation.protocol === SOAP_PROTOCOL ||
      operation.protocol === SOAP12_PROTOCOL) {
      return this.getSOAPBodyMessage(elementToCreateBody, securityPolicyArray, operation.protocol,
        xmlParser);
    }
    if (operation.protocol === HTTP_PROTOCOL) {
      return this.createBodyForHTTP(operation, elementToCreateBody, securityPolicyArray, false, xmlParser);
    }
  }


  /**
  * Generate an array with Items in postman definition format from an array of operations parsed from
  * a wsdl file
  * @param {object} operation the operation to generate the request's body
  * @param {*} elementToCreateBody the root node for the message parameters
  * @param {array} securityPolicyArray An array with all security policies
  * @param {object} xmlParser the parser class to parse xml to object or vice versa
  * @returns {array} An array with all items generated in postman item definition format
  */
  createBodyForSOAP(operation, elementToCreateBody, securityPolicyArray, xmlParser) {
    return {
      mode: 'raw',
      raw: this.getSOAPBodyMessage(elementToCreateBody, securityPolicyArray, operation.protocol,
        xmlParser),
      options: {
        raw: {
          language: XML
        }
      }
    };
  }

  /**
  * Generate an array with Items in postman definition format from an array of operations parsed from
  * a wsdl file
  * @param {object} operation the operation to generate the request's body
  * @param {*} elementToCreateBody the root node for the message parameters
  * @param {array} securityPolicyArray An array with all security policies
  * @param {boolean} isInput if the body message corresponds to an input
  * @param {object} xmlParser the parser class to parse xml to object or vice versa
  * @returns {array} An array with all items generated in postman item definition format
  */
  createBodyForHTTP(operation, elementToCreateBody, securityPolicyArray, isInput, xmlParser) {
    if (isInput) {
      if (operation.mimeContentInput && operation.mimeContentInput.type === URL_ENCODED) {
        let helper = new URLEncodedParamsHelper();
        return {
          mode: 'urlencoded',
          urlencoded: helper.convertInputToURLEncoded(elementToCreateBody)
        };
      }
      return this.createBodyForSOAP(operation, elementToCreateBody, securityPolicyArray, xmlParser);
    }
    else if (!isInput) {
      let helper = new XMLMessageHelper();
      if (operation.mimeContentOutput && operation.mimeContentOutput.mimeType === MIME_TYPE_XML) {
        return helper.convertInputToMessage(elementToCreateBody, xmlParser);
      }
      return this.getSOAPBodyMessage(elementToCreateBody, securityPolicyArray, operation.protocol,
        xmlParser);
    }
  }


  /**
  * Generates the xml body message
  * Takes in a node representing the message for a soap call
  * returns an string with the body message
  * @param {*} nodeElement the root node for the message parameters
  * @param {array} securityPolicyArray An array with all security policies
  * @param {string} protocol  the protocol to implement the message default 'soap'
  * @param {object} xmlParser the parser class to parse xml to object or vice versa
  * @returns {string} the message xml with the structure determined in the
  * elements and the default values examples
  */
  getSOAPBodyMessage(nodeElement, securityPolicyArray, protocol, xmlParser) {
    const soapMessageHelper = new SOAPMessageHelper();
    return soapMessageHelper.convertInputToMessage(nodeElement, securityPolicyArray, protocol,
      xmlParser);
  }

}
module.exports = {
  WsdlToPostmanCollectionBodyMapper
};
