const chai = require('chai');
const expect = chai.expect;

const request = require("supertest");
const APP_URL = "http://localhost:3000"; // Assuming that it's deploying serverless mode offline

const { Author, Publication } = require('../../src/models')
const truncate = require('../truncate');

const demoAuthors = [];

describe("Author Endpoints tests using SUPERTEST: ", function () {

  describe("GET /authors", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: "Walter", lastName: "Lee", email: "wlee@example.com" });
      demoAuthors[1] = await Author.create({ firstName: "Davy", lastName: "Jonas", email: "djonas@example.com" });
      demoAuthors[2] = await Author.create({ firstName: "Paul", lastName: "Hugh", email: "phugh@example.com" });
    });

    it("This request should obtain 3 authors in response", function (done) {
      request(APP_URL)
        .get("/authors")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          // response.body contain the response data
          expect(response.body.length).to.equal(3);
          expect(response.body[0].email).to.equal(demoAuthors[0].email);
          expect(response.body[1].email).to.equal(demoAuthors[1].email);
          expect(response.body[2].email).to.equal(demoAuthors[2].email);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("POST /authors", function () {

    it("This request should store an author within the database and obtain a new author's id in response", function (done) {
      request(APP_URL)
        .post("/authors")
        .send({ firstName: "Freddy", lastName: "Linch", email: "flinch@example.com" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .then(async (response) => {
          // response.body contain the response data
          const toCompare = await Author.findByPk(response.body.id);
          expect(toCompare.id).to.equal(response.body.id);
          expect(toCompare.firstName).to.equal("Freddy");
          expect(toCompare.lastName).to.equal("Linch");
          expect(toCompare.email).to.equal("flinch@example.com");

          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("GET /authors/{id}", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: "Kevin", lastName: "De Bruyne", email: "kdbruyne@example.com" });
    });

    it("This request should obtain author's details given an id", function (done) {
      request(APP_URL)
        .get("/authors/" + demoAuthors[0].id)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          // response.body contain the response data
          expect(response.body.author.id).to.equal(demoAuthors[0].id);
          expect(response.body.author.email).to.equal(demoAuthors[0].email);
          expect(response.body.author.firstName).to.equal(demoAuthors[0].firstName);
          expect(response.body.author.lastName).to.equal(demoAuthors[0].lastName);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("PATCH /authors/{id}", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: "Kyle", lastName: "Walker", email: "kwalker@example.com" });
    });

    it("This request should update an author within the database and obtain a its id in response", function (done) {
      request(APP_URL)
        .patch("/authors/" + demoAuthors[0].id)
        .send({ firstName: "Steven", birthDate: "1990-02-23" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          // response.body contain the response data
          expect(response.body.id).to.equal(demoAuthors[0].id);
          const toCompare = await Author.findByPk(response.body.id);
          expect(toCompare.id).to.equal(response.body.id);
          expect(toCompare.firstName).to.equal("Steven");
          expect(toCompare.lastName).to.equal("Walker");
          expect(toCompare.birthDate).to.equal("1990-02-23");
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("DELETE /authors/{id}", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: "Sami", lastName: "Khedira", email: "skhedira@example.com" });
    });

    it("This request should delete an author within the database and obtain a its id in response", function (done) {
      request(APP_URL)
        .delete("/authors/" + demoAuthors[0].id)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          // response.body contain the response data
          expect(response.body.id).to.equal(demoAuthors[0].id);
          const toCompare = await Author.findByPk(response.body.id);
          expect(toCompare).to.equal(null);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
// ----------------------------------------------------------------------------------------------------------- //

const demoAuthorPublications = [];
describe("Publication Endpoints tests using SUPERTEST: ", function () {

  describe("GET /authors/{author_id}/publications", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'jhughes@example.com' });
      demoAuthorPublications[0] = await demoAuthors[0].createPublication({ title: 'Title 1', body: 'Example of body 1' });
      demoAuthorPublications[1] = await demoAuthors[0].createPublication({ title: 'Title 2', body: 'Example of body 2' });
    });

    it("This request should obtain 2 publications of an author in response", function (done) {
      request(APP_URL)
        .get("/authors/"+ demoAuthors[0].id +"/publications")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          // response.body contain the response data
          expect(response.body.length).to.equal(2);
          expect(response.body[0].title).to.equal(demoAuthorPublications[0].title);
          expect(response.body[1].title).to.equal(demoAuthorPublications[1].title);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("POST /authors/{author_id}/publications", function () {
    beforeEach(async () => {

      demoAuthors[0] = await Author.create({ firstName: 'Steve', lastName: 'Johns', email: 'sjohns@example.com' });
    });

    it("This request should store an author's publication within the database and obtain a new publication's id in response", function (done) {
      request(APP_URL)
        .post("/authors/"+ demoAuthors[0].id +"/publications")
        .send({ title: 'About Superliga', body: 'I think this is bad idea' })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .then(async (response) => {
          // response.body contain the response data
          const toCompare = await Publication.findByPk(response.body.publicationId);
          expect(toCompare.id).to.equal(response.body.publicationId);
          expect(toCompare.title).to.equal('About Superliga');
          expect(toCompare.body).to.equal('I think this is bad idea');
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("GET /authors/{author_id}/publications/{id}", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'jhughes@example.com' });
      demoAuthorPublications[0] = await demoAuthors[0].createPublication({ title: 'This is a title?', body: 'This is the body?' });
    });

    it("This request should obtain author's details given an id", function (done) {
      request(APP_URL)
        .get("/authors/"+ demoAuthors[0].id +"/publications/" + demoAuthorPublications[0].id)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          // response.body contain the response data
          expect(response.body.publication.id).to.equal(demoAuthorPublications[0].id);
          expect(response.body.publication.title).to.equal(demoAuthorPublications[0].title);
          expect(response.body.publication.body).to.equal(demoAuthorPublications[0].body);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("PATCH /authors/{author_id}/publications/{id}", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'jhughes@example.com' });
      demoAuthorPublications[0] = await demoAuthors[0].createPublication({ title: 'This is a good title', body: 'This is the best body' });
    });

    it("This request should update an author's publication within the database and obtain a its id in response", function (done) {
      request(APP_URL)
        .patch("/authors/"+ demoAuthors[0].id +"/publications/" + demoAuthorPublications[0].id)
        .send({ title: "Sorry, this is new title", body: "Upps, this body was wrong" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          // response.body contain the response data
          expect(response.body.publicationId).to.equal(demoAuthorPublications[0].id);
          const toCompare = await Publication.findByPk(response.body.publicationId);
          expect(toCompare.id).to.equal(response.body.publicationId);
          expect(toCompare.title).to.equal("Sorry, this is new title");
          expect(toCompare.body).to.equal("Upps, this body was wrong");
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe("DELETE /authors/{author_id}/publications/{id}", function () {

    beforeEach(async () => {
      console.info("Before each tests: truncate");
      await truncate();
  
      demoAuthors[0] = await Author.create({ firstName: 'Donald', lastName: 'Hughes', email: 'jhughes@example.com' });
      demoAuthorPublications[0] = await demoAuthors[0].createPublication({ title: 'An example of great title', body: 'An example of great body' });
    });

    it("This request should delete an author's publication within the database and obtain a its id in response", function (done) {
      request(APP_URL)
        .delete("/authors/"+ demoAuthors[0].id +"/publications/" + demoAuthorPublications[0].id)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(async (response) => {
          // response.body contain the response data
          expect(response.body.publicationId).to.equal(demoAuthorPublications[0].id);
          const toCompare = await Publication.findByPk(response.body.publicationId);
          expect(toCompare).to.equal(null);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
