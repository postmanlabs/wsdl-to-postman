module.exports = [
  {
    required: [
      'facilityId',
      'carParkNumber',
      'countingCategoryType',
      'trafficSignalMode'
    ],
    properties: {
      facilityId: {
        $ref: 'FORWARD_REFERENCE#/to/http://{{url}}/interfaces/parking/operatorServices/v1/data/long'
      },
      carParkNumber: {
        $ref: 'FORWARD_REFERENCE#/to/http://{{url}}/interfaces/parking/operatorServices/v1/data/int'
      },
      countingCategoryType: {
        $ref: '#/definitions/countingCategoryType'
      },
      trafficSignalMode: {
        $ref: '#/definitions/trafficSignalMode'
      }
    },
    type: 'object',
    name: 'SetCountingCategoryMode',
    fullName: 'schema_0.json#/definitions/SetCountingCategoryMode',
    dependencies: {
    }
  },
  {
    required: [
      'SetCountingCategoryModeResponse'
    ],
    properties: {
      SetCountingCategoryModeResponse: {
        $ref: '#/definitions/SetCountingCategoryModeResponse'
      }
    },
    type: 'object',
    name: 'SetCountingCategoryModeOut',
    fullName: 'schema_0.json#/definitions/SetCountingCategoryModeOut',
    dependencies: {
    }
  },
  {
    required: [
      'facilityId',
      'carParkNumber',
      'countingCategoryType',
      'currentLevel'
    ],
    properties: {
      facilityId: {
        $ref: 'FORWARD_REFERENCE#/to/http://{{url}}/interfaces/parking/operatorServices/v1/data/long'
      },
      carParkNumber: {
        $ref: 'FORWARD_REFERENCE#/to/http://{{url}}/interfaces/parking/operatorServices/v1/data/int'
      },
      countingCategoryType: {
        $ref: '#/definitions/countingCategoryType'
      },
      currentLevel: {
        $ref: 'FORWARD_REFERENCE#/to/http://{{url}}/interfaces/parking/operatorServices/v1/data/int'
      }
    },
    type: 'object',
    name: 'SetCountingCategoryLevel',
    fullName: 'schema_0.json#/definitions/SetCountingCategoryLevel',
    dependencies: {
    }
  },
  {
    required: [
      'SetCountingCategoryLevelResponse'
    ],
    properties: {
      SetCountingCategoryLevelResponse: {
        $ref: '#/definitions/SetCountingCategoryLevelResponse'
      }
    },
    type: 'object',
    name: 'SetCountingCategoryLevelOut',
    fullName: 'schema_0.json#/definitions/SetCountingCategoryLevelOut',
    dependencies: {
    }
  },
  {
    required: [
      'facilityId'
    ],
    properties: {
      facilityId: {
        $ref: 'FORWARD_REFERENCE#/to/http://{{url}}/interfaces/parking/operatorServices/v1/data/long'
      }
    },
    type: 'object',
    name: 'SetExternalCountingMode',
    fullName: 'schema_0.json#/definitions/SetExternalCountingMode',
    dependencies: {
    }
  },
  {
    required: [
      'SetExternalCountingModeResponse'
    ],
    properties: {
      SetExternalCountingModeResponse: {
        $ref: '#/definitions/SetExternalCountingModeResponse'
      }
    },
    type: 'object',
    name: 'SetExternalCountingModeOut',
    fullName: 'schema_0.json#/definitions/SetExternalCountingModeOut',
    dependencies: {
    }
  }
];
