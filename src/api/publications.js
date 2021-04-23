const { Author, Publication } = require('../models');

module.exports.index = async (event, context, callback) => {
  try {
    const authorId = event.pathParameters.authorId;
    const author = await Author.findByPk(authorId);
    if( !author ){
      return {
        statusCode: 404, body: JSON.stringify({  message: 'Author not found!',  authorId })
      }
    }
    const publications = await author.getPublications({
      attributes: ['id', 'title', 'body'], order: [ ['id', 'ASC'] ]
    });
    return {
      statusCode: 200,
      body: JSON.stringify(publications, null, 2)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify( error ) }
  } 
};

module.exports.store = async (event, context, callback) => {
  try {
    const authorId = event.pathParameters.authorId;
    const { title, body } = JSON.parse(event.body); //it's necesary to parse event's body
    const author = await Author.findByPk(authorId);
    if( !author ){
      return {
        statusCode: 404, body: JSON.stringify({  message: 'Author not found!',  authorId })
      }
    }
    const publication = await author.createPublication({ title, body });
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Successful creation!',
        publicationId: publication.id
      }, null, 2)
    };
  } catch (error) {
    let statusCode = (error.name === 'SequelizeValidationError') ? 400 : 500;
    return { statusCode, body: JSON.stringify( error ) }
  }

};

module.exports.show = async (event, context, callback) => {
  try {
    const authorId = event.pathParameters.authorId;
    const author = await Author.findByPk(authorId);
    if( !author ){
      return {
        statusCode: 404, body: JSON.stringify({  message: 'Author not found!',  authorId })
      }
    }
    const publicationId = event.pathParameters.publicationId;
    const [publication] = await author.getPublications({
      where: { id: publicationId }
    });

    return {
      statusCode: publication ? 200 : 404,
      body: JSON.stringify({ 
        message: publication ? 'Publication found!' : 'Publication not found!', 
        publication: publication || null
      }, null, 2)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify( error ) }
  }
};

module.exports.update = async (event, context, callback) => {
  try {
    const authorId = event.pathParameters.authorId;
    const author = await Author.findByPk(authorId);
    if( !author ){
      return {
        statusCode: 404, body: JSON.stringify({  message: 'Author not found!',  authorId })
      }
    }
    const publicationId = event.pathParameters.publicationId;
    const { title, body } = JSON.parse(event.body); //it's necesary to parse event's body
    const publication = await Publication.findByPk(publicationId);
    if( !publication || author.id !== publication.authorId ){
      return {
        statusCode: 404, body: JSON.stringify({ message: 'Publication not found!', publicationId })
      }
    }
    publication.title = title;
    publication.body = body;
    await publication.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successful update!',
        publicationId: publication.id
      }, null, 2)
    };
  } catch (error) {
    let statusCode = (error.name === 'SequelizeValidationError') ? 400 : 500;
    return { statusCode, body: JSON.stringify( error ) }
  }
};


module.exports.delete = async (event, context, callback) => {
  try {
    const authorId = event.pathParameters.authorId;
    const author = await Author.findByPk(authorId);
    if( !author ){
      return {
        statusCode: 404, body: JSON.stringify({  message: 'Author not found!', authorId })
      }
    }
    const publicationId = event.pathParameters.publicationId;
    const publication = await Publication.findByPk(publicationId);
    if( !publication || author.id !== publication.authorId ){
      return {
        statusCode: 404, body: JSON.stringify({ message: 'Publication not found!', publicationId })
      }
    }
    await publication.destroy();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Successful elimination!',
        publicationId: publication.id
      }, null, 2)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify( error ) }
  }
};