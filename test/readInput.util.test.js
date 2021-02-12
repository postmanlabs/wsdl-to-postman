const expect = require('chai').expect,
  fs = require('fs'),
  {
    readInput
  } = require('../utils/readInput');

describe('readInput utility', function() {
  const mockInput = function(data = '', type = 'string') {
    return {
      type,
      data
    };
  };
  describe('When input.type is "string"', function() {
    it('Should return a string if input.data is a string', function() {
      const input = mockInput('<definitions ...> ... </definitions>', 'string');
      expect(readInput(input)).to.be.a('string');
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

    it('Should return a string if input.data is a file path', function() {
      const input = mockInput(mockFilePath, 'file'),
        result = readInput(input);
      expect(result).to.be.a('string').and.to.equal(mockFileContent);
    });

    it('Should throw an error if provided file path does not exists', function() {
      const input = mockInput('this/path/does/not/exists.txt', 'file');
      try {
        readInput(input);
      }
      catch (error) {
        expect(error.message).to.equal(`File ${input.data.split('/').reverse()[0]} not found`);
      }
    });
  });
});
