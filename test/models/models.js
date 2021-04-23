const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised); //chai-as-promised extends Chai with a fluent language for asserting facts about promises

const expect = chai.expect;

const { Author, Publication } = require('../../src/models')
const truncate = require('../truncate');

describe("Author Model tests using EXPECT interface from CHAI module: ", function () {

  beforeEach(async () => {
    console.info("Before each tests: truncate");
    await truncate();
  });

  describe("Check CRUD operations: ", function () {
    it('Check bulkCreate() and findAll() methods with 3 authors previously created', async function(){
      await Author.bulkCreate([
        { firstName: 'Walter', lastName: 'Lee', email: 'wlee@example.com' },
        { firstName: 'Davy', lastName: 'Jonas', email: 'djonas@example.com' },
        { firstName: 'Paul', lastName: 'Hugh', email: 'phugh@example.com' }
      ]);
      const authors = await Author.findAll({
        attributes: ['email'], order: [ ['email', 'ASC'] ]
      });
      expect(authors.length).to.equal(3);
      expect(authors[0].email).to.equal('djonas@example.com');
      expect(authors[1].email).to.equal('phugh@example.com');
      expect(authors[2].email).to.equal('wlee@example.com');
    });

    it('Check create() and findByPk() methods with an author previously created', async function(){
      const author = await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'dhughes@example.com' });
      const toCompare = await Author.findByPk(author.id);
      expect(author.id).to.equal(toCompare.id);
      expect(author.firstName).to.equal(toCompare.firstName);
      expect(author.lastName).to.equal(toCompare.lastName);
      expect(author.email).to.equal(toCompare.email);
    });

    it('Check create() method with 2 authors with the same email', async function(){
      await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'dhughes@example.com' });
      expect(Author.create({ firstName: 'Draco', lastName: 'Hughes', email: 'dhughes@example.com' })).to.eventually.be.rejected; 
    });

    it('Check create(), save() and findByPk() methods with an author previously created', async function(){
      const author = await Author.create({ firstName: 'Steve', lastName: 'Newman', email: 'snewman@example.com' });
      // Updating fields
      author.firstName = 'Hulk';
      author.lastName = 'Hogan';
      author.email = 'hhogan@example.com';
      await author.save()
      const toCompare = await Author.findByPk(author.id);

      expect(author.firstName).to.equal(toCompare.firstName);
      expect(author.lastName).to.equal(toCompare.lastName);
      expect(author.email).to.equal(toCompare.email);
    });

    it('Check create(), destroy() and findByPk() methods with an author previously created', async function(){
      const author = await Author.create({ firstName: 'Arnold', lastName: 'Botin', email: 'abotin@example.com' });
      await author.destroy();
      const toCompare = await Author.findByPk(author.id);

      expect(toCompare).to.equal(null);
    });
  });

  after(function () {
    console.info("After all Author Model tests");
  });
});


describe("Publication Model tests using EXPECT interface from CHAI module: ", function () {

  beforeEach(async () => {
    console.info("Before each tests: truncate");
    await truncate();
  });
  
  describe("Check CRUD operations: ", function () {
    it('Check createPublication() and getPublications() methods with 3 publications previously created', async function(){
      const author = await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'jhughes@example.com' });
      const publication1 = await author.createPublication({ title: 'Title 1', body: 'Example of body 1' });
      const publication2 = await author.createPublication({ title: 'Title 2', body: 'Example of body 2' });
      const publication3 = await author.createPublication({ title: 'Title 3', body: 'Example of body 3' });
      
      const publications = await author.getPublications({
        attributes: ['title'], order: [ ['title', 'ASC'] ]
      });
      
      expect(publications.length).to.equal(3);
      expect(publications[0].title).to.equal(publication1.title);
      expect(publications[1].title).to.equal(publication2.title);
      expect(publications[2].title).to.equal(publication3.title);
    });

    it('Check createPublication() and Publication.findByPk() methods with a publication previously created', async function(){
      const author = await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'jhughes@example.com' });
      const publication1 = await author.createPublication({ title: 'Title 1', body: 'Example of body 1' });
      const toCompare = await Publication.findByPk(publication1.id);
      expect(publication1.id).to.equal(toCompare.id);
      expect(publication1.title).to.equal(toCompare.title);
      expect(publication1.body).to.equal(toCompare.body);
      expect(publication1.authorId).to.equal(toCompare.authorId);
      expect(author.id).to.equal(toCompare.authorId);
    });

    it('Check createPublication(), Publication.save() and getPublications() methods with a publication previously created', async function(){
      const author = await Author.create({ firstName: 'Steve', lastName: 'Newman', email: 'snewman@example.com' });
      const author2 = await Author.create({ firstName: 'Hulk', lastName: 'Hogan', email: 'hhogan@example.com' });
      const publication1 = await author.createPublication({ title: 'Title 1', body: 'Example of body 1' });
      // Updating fields
      publication1.title = 'Title 1 modified';
      publication1.body = 'Example of body 1 modified';
      publication1.authorId = author2.id;
      await publication1.save();
      const [toCompare] = await author2.getPublications();

      expect(publication1.title).to.equal(toCompare.title);
      expect(publication1.body).to.equal(toCompare.body);
      expect(publication1.authorId).to.equal(toCompare.authorId);
    });

    it('Check createPublication(), Publication.destroy() and Publication.findByPk() methods with a publication previously created', async function(){
      const author = await Author.create({ firstName: 'Arnold', lastName: 'Botin', email: 'abotin@example.com' });
      const publication1 = await author.createPublication({ title: 'Title 1', body: 'Example of body 1' });
      await publication1.destroy();
      const toCompare = await Publication.findByPk(publication1.id);

      expect(toCompare).to.equal(null);
    });
  });

  after(function () {
    console.info("After all Publication Model tests");
  });

});