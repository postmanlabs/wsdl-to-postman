module.exports = {
  matched: true,
  requests: {
    '18403328-4213-4c3e-b0e9-b21a636697c3': {
      endpoints: [{
        matched: true,
        endpointMatchScore: 1,
        endpoint: 'POST soap12 NumberToDollars',
        mismatches: [],
        responses: {
          '1763f0b2-9f34-4796-a390-b94ee5c37c7c': {
            id: '1763f0b2-9f34-4796-a390-b94ee5c37c7c',
            matched: true,
            mismatches: []
          }
        }
      }],
      requestId: '18403328-4213-4c3e-b0e9-b21a636697c3'
    },
    '353e33da-1eee-41c1-8865-0f72b2e1fd10': {
      endpoints: [{
        matched: true,
        endpointMatchScore: 1,
        endpoint: 'POST soap12 NumberToWords',
        mismatches: [],
        responses: {
          'c8a892b6-4b2e-4523-9cc3-fc3e08c835c4': {
            id: 'c8a892b6-4b2e-4523-9cc3-fc3e08c835c4',
            matched: true,
            mismatches: []
          }
        }
      }],
      requestId: '353e33da-1eee-41c1-8865-0f72b2e1fd10'
    },
    '395c9db6-d6f5-45a7-90f5-09f5aab4fe92': {
      endpoints: [{
        matched: true,
        endpointMatchScore: 1,
        endpoint: 'POST soap NumberToDollars',
        mismatches: [],
        responses: {
          '8a0c6532-84f9-45c7-838a-f4bf1a6de002': {
            id: '8a0c6532-84f9-45c7-838a-f4bf1a6de002',
            matched: true,
            mismatches: []
          }
        }
      }],
      requestId: '395c9db6-d6f5-45a7-90f5-09f5aab4fe92'
    },
    'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0': {
      endpoints: [],
      requestId: 'aebb36fc-1be3-44c3-8f4a-0b5042dc17d0'
    }
  },
  missingEndpoints: [
    {
      property: 'ENDPOINT',
      transactionJsonPath: null,
      schemaJsonPath: 'soap NumberToWords',
      reasonCode: 'MISSING_ENDPOINT',
      reason: 'The endpoint "POST soap NumberToWords" is missing in collection',
      endpoint: 'POST soap NumberToWords'
    }
  ]
};
