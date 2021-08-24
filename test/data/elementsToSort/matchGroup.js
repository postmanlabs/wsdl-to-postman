module.exports = [
  {
    required: [
      'id',
      'Name',
      'MatchClassId',
      'IsPlayoffLeague',
      'IsPlayoff',
      'PlayoffId',
      'EndGameLevel'
    ],
    properties: {
      id: {
        maximum: 2147483647,
        minimum: -2147483648,
        type: 'integer'
      },
      Name: {
        type: 'string'
      },
      MatchClassId: {
        type: 'string'
      },
      IsPlayoffLeague: {
        oneOf: [
          {
            type: 'boolean'
          },
          {
            maximum: 1,
            minimum: 0,
            type: 'integer'
          }
        ]
      },
      IsPlayoff: {
        oneOf: [
          {
            type: 'boolean'
          },
          {
            maximum: 1,
            minimum: 0,
            type: 'integer'
          }
        ]
      },
      PlayoffId: {
        type: 'string'
      },
      EndGameLevel: {
        maximum: 2147483647,
        minimum: -2147483648,
        type: 'integer'
      }
    },
    type: 'object',
    name: 'MatchGroup',
    fullName: 'schema_0.json#/definitions/MatchGroup'
  },
  {
    properties: {
      item: {
        oneOf: [
          {
            $ref: '#/definitions/MatchGroup'
          },
          {
            items: {
              $ref: '#/definitions/MatchGroup'
            },
            type: 'array'
          }
        ]
      }
    },
    type: 'object',
    name: 'ArrayOfMatchGroup',
    fullName: 'schema_0.json#/definitions/ArrayOfMatchGroup'
  },
  {
    required: [
      'id',
      'Code',
      'Name',
      'Gender',
      'PeriodLengthInMinutes',
      'HideTable',
      'HideResults',
      'NumberOfPeriodsInMatch',
      'MatchGroups'
    ],
    properties: {
      id: {
        maximum: 2147483647,
        minimum: -2147483648,
        type: 'integer'
      },
      Code: {
        type: 'string'
      },
      Name: {
        type: 'string'
      },
      Gender: {
        type: 'string'
      },
      PeriodLengthInMinutes: {
        type: 'string'
      },
      HideTable: {
        type: 'string'
      },
      HideResults: {
        type: 'string'
      },
      NumberOfPeriodsInMatch: {
        type: 'string'
      },
      MatchGroups: {
        $ref: '#/definitions/ArrayOfMatchGroup'
      }
    },
    type: 'object',
    name: 'MatchClass',
    fullName: 'schema_0.json#/definitions/MatchClass'
  },
  {
    properties: {
      item: {
        oneOf: [
          {
            $ref: '#/definitions/MatchClass'
          },
          {
            items: {
              $ref: '#/definitions/MatchClass'
            },
            type: 'array'
          }
        ]
      }
    },
    type: 'object',
    name: 'ArrayOfMatchClass',
    fullName: 'schema_0.json#/definitions/ArrayOfMatchClass'
  }
];
