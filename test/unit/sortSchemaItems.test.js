const { expect } = require('chai'),
  { sortElementsAccordingToDependencies } = require('../../lib/utils/sortSchemaItemsUtils'),
  elementsToSort = require('../data/elementsToSort/matchGroup'),
  elementsToSortCounting = require('../data/elementsToSort/countingCategory');

describe('sortElementsAccordingToDependencies method', function () {

  it('should return the elements sorted', function () {
    let sorted = sortElementsAccordingToDependencies(elementsToSort);

    expect(sorted).to.be.a('Array');
    expect(sorted.length).to.equal(4);
    expect(sorted[0].name).to.equal('MatchGroup');
    expect(sorted[1].name).to.equal('ArrayOfMatchGroup');
    expect(sorted[2].name).to.equal('MatchClass');
    expect(sorted[3].name).to.equal('ArrayOfMatchClass');
  });

  it('should return the elements sorted when they are inverted', function () {
    let reversed = elementsToSort.reverse(),
      sorted = sortElementsAccordingToDependencies(reversed);
    expect(sorted).to.be.a('Array');
    expect(sorted.length).to.equal(4);
    expect(sorted[0].name).to.equal('MatchGroup');
    expect(sorted[1].name).to.equal('ArrayOfMatchGroup');
    expect(sorted[2].name).to.equal('MatchClass');
    expect(sorted[3].name).to.equal('ArrayOfMatchClass');
  });

  it('should return the elements elementsToSortCounting sorted', function () {
    let sorted = sortElementsAccordingToDependencies(elementsToSortCounting);
    expect(sorted).to.be.a('Array');
    expect(sorted.length).to.equal(6);
    expect(sorted[0].name).to.equal('SetExternalCountingMode');
    expect(sorted[1].name).to.equal('SetExternalCountingModeOut');
    expect(sorted[2].name).to.equal('SetCountingCategoryLevel');
    expect(sorted[3].name).to.equal('SetCountingCategoryLevelOut');
    expect(sorted[4].name).to.equal('SetCountingCategoryMode');
    expect(sorted[5].name).to.equal('SetCountingCategoryModeOut');
  });

});
