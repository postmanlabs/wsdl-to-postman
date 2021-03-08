const expect = require('chai').expect,
  fs = require('fs'),
  {
    readInput,
    getCollectionNameFromFileOrEmpty
  } = require('../../lib/utils/readInput');

describe('readInput utility', function() {
  const mockInput = function(data = '', type = 'string') {
    return {
      type,
      data
    };
  };

  describe('When input.type is "string"', function() {
    it('Should throw an error when input.data is null', function() {
      const nullInput = mockInput(null, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(nullInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is undefined', function() {
      const undefinedInput = mockInput(undefined, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(undefinedInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is empty', function() {
      const emptyInput = mockInput('', 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(emptyInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should return a string if input.data is a string', function() {
      const input = mockInput('<definitions ...> ... </definitions>', 'string');
      expect(readInput(input)).to.be.a('string');
    });

    describe('getCollectionNameFromFileOrEmpty method', function() {
      it('Should return an empty string as name', function() {
        const input = mockInput('<definitions ...> ... </definitions>', 'string'),
          name = getCollectionNameFromFileOrEmpty(input);
        expect(name).to.be.a('string')
          .to.equal('');
      });
    });
  });

  describe('When input.type is "file"', function() {
    const mockFilePath = __dirname + '/temporal_file_mock.txt',
      mockFileContent = '<definitions ...> ... </definitions>';
    before(function() {
      fs.writeFileSync(mockFilePath, mockFileContent, (error) => {
        if (error) {
          console.error('There was an error mocking the test file.');
        }
      });
    });

    after(function() {
      fs.unlinkSync(mockFilePath, function(error) {
        if (error) {
          console.error('There was an error deleting mock temporal file');
        }
      });
    });

    it('Should return a string if input.data is a valid file path', function() {
      const input = mockInput(mockFilePath, 'file'),
        result = readInput(input);
      expect(result).to.be.a('string').and.to.equal(mockFileContent);
    });

    it('Should throw an error if provided file path does not exists', function() {
      const input = mockInput('this/path/does/not/exists.txt', 'file');
      try {
        readInput(input);
        assert.fail('we expected an error');
      }
      catch (error) {
        expect(error.message).to.equal(`File ${input.data.split('/').reverse()[0]} not found`);
      }
    });

    it('Should throw an error when input.data is null', function() {
      const nullInput = mockInput(null, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(nullInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is undefined', function() {
      const undefinedInput = mockInput(undefined, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(undefinedInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is empty', function() {
      const emptyInput = mockInput('', 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(emptyInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    describe('getCollectionNameFromFileOrEmpty method', function() {
      it('Should return the provided file name', function() {
        const fileName = 'temporal_file_mock.txt',
          input = mockInput(mockFilePath, 'file'),
          name = getCollectionNameFromFileOrEmpty(input);
        expect(name).to.be.a('string')
          .to.equal(fileName);
      });
    });
  });
});
