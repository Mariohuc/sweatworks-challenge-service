const faker = require('faker');
const models = require('../../models');
/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 * 
 * @param  {Object} props Properties to use for the user.
 * 
 * @return {Object}       An object to build the user from.
 */
const data = (props = {}) => {
  const defaultProps = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    birthDate: faker.date.between('1990-01-01', '1990-12-25')
  };
  return Object.assign({}, defaultProps, props);
};

const manyData = (amount = 10) => {
  const result = [];
  for(let i=0; i < amount; i++){
    result.push({
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthDate: faker.date.between('1990-01-01', '1990-12-25')
    })
  }
  
  return result;
};
/**
 * Generates a user instance from the properties provided.
 * 
 * @param  {Object} props Properties to use for the user.
 * 
 * @return {Object}       A user instance
 */
 module.exports.create = (props = {}) => models.Author.create( data(props) );

 module.exports.createMany = (amount = 10) => models.Author.bulkCreate( manyData(amount) );