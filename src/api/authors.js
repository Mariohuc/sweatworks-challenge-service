const { Author } = require('../models');

module.exports.index = async (event, context, callback) => {
  try {
    const authors = await Author.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email']
    });
    return {
      statusCode: 200,
      body: JSON.stringify(authors, null, 2)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify( error ) }
  } 
};

module.exports.store = async (event, context, callback) => {
  try {
    const { firstName, lastName, email, birthDate } = JSON.parse(event.body); //it's necesary to parse event's body
    
    const author = await Author.create({ firstName, lastName, email, birthDate });
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Successful creation!',
        id: author.id
      }, null, 2)
    };
  } catch (error) {
    let statusCode = (error.name === 'SequelizeValidationError') ? 400 : 500;
    return { statusCode, body: JSON.stringify( error ) }
  }

};

module.exports.show = async (event, context, callback) => {
  try {
    const author_id = event.pathParameters.id;
    const author = await Author.findByPk(author_id);

    return {
      statusCode: author ? 200 : 404,
      body: JSON.stringify({ 
        message: author ? 'Found!' : 'Not found!', 
        author: author 
      }, null, 2)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify( error ) }
  }
};

module.exports.update = async (event, context, callback) => {
  try {
    const author_id = event.pathParameters.id;
    const { firstName, lastName, birthDate } = JSON.parse(event.body);
    const author = await Author.findByPk(author_id);
    if( !author ){
      return {
        statusCode: 404, body: JSON.stringify({  message: 'Not found!',  id: author_id })
      }
    }
    author.firstName = firstName;
    author.lastName = lastName;
    author.birthDate = birthDate;
    await author.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successful update!',
        id: author_id
      }, null, 2)
    };
  } catch (error) {
    let statusCode = (error.name === 'SequelizeValidationError') ? 400 : 500;
    return { statusCode, body: JSON.stringify( error ) }
  }
};


module.exports.delete = async (event, context, callback) => {
  try {
    const author_id = event.pathParameters.id;
    const author = await Author.findByPk(author_id);
    if( !author ){
      return {
        statusCode: 404, body: JSON.stringify({  message: 'Not found!',  id: author_id })
      }
    }
    await author.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Successful elimination!',
        id: author_id 
      }, null, 2)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify( error ) }
  }
};