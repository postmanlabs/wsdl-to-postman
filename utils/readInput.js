const InputError = require('../lib/inputError');

function readInput(input){
    let xml;
    if(input.type === 'file'){
        try{
            xml = fs.readFileSync(input.data, 'utf-8');
        } catch(error){
            throw new InputError(error.message);
        }
    } else if(input.type === 'string'){
        xml = input.data;
    } else {
        throw new InputError(`Invalid input type (${input.type}). Type must be file/json/string.`);
    }

    return xml;
}

module.exports = {
    readInput
}
