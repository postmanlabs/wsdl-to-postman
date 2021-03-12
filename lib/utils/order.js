const traverseUtility = require('traverse');

function searchAndAssignComplex2(origin) {
  let independant = [],
    dependant = [];
  origin.forEach((element) => {
    let isDependant = false;
    element.dependencies = new Set();
    traverseUtility(element).forEach(function(property) {

      hasRef = Object.keys(property)
        .find(
          (key) => {
            return key === '$ref';
          }
        );

      if (hasRef) {
        element.dependencies.add(property.$ref)
        isDependant = true;
      }

    });
    if (!isDependant) {
      independant.push(element)
    }
    else {
      processDependant(dependant, element)
    }
  });
  //   console.log(independant)
  //   console.log(dependant)
  return independant.concat(dependant)
}

function processDependant(dependant, element) {
  let dependencyArray = [...element.dependencies]
  let lastIndex = -1;
  for (i = 0; i < dependant.length; i++) {
    if (dependencyArray.includes(dependant[i].name)) {
      lastIndex = i
    }
  }

  if (lastIndex == -1) {
    dependant.unshift(element)
  }
  else {
    dependant.splice(2, lastIndex + 1, element);
  }
}



module.exports = {
  searchAndAssignComplex2,
};
