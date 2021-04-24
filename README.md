# SweatWorks Test

## Interviewee Notes

According to the specs:
- It was built a restful API that perform CRUD operations on authors and publications resources.
  - Authors resources handle that routes `/authors`, 
  - While publications resources handle nested routes of the form `/authors/{authorId}/publications`, this because within the database a one-to-many association was defined between the` Sequelize` models, that is, an author has many publications and a publication belongs to an author.
- A single lambda function was created for each endpoint. See `serverless.yml`.
- About unit test, only the **Author** and **Publication** models and their methods were tested, these tests are in `test/models/models.js`
  - **Mocha** and **Chai** were used.
- About integration tests, the API endpoints were tested using the serverless-offline plugin to be able to emulate AWS Lamda and API Gateway locally and thus speed up the testing cycle. These tests are in `test/api/api.js`
  - **SuperTest** was used to test HTTP requests.
- Some scripts have been defined to run certain repetitive tasks
  - To run migrations, use the command `npm run migrate`. Make sure to configure the database credentials to use with Sequelize, do it using the file `src/config/config.js`. By default process.env.NODE_ENV is as development.
  - To seed your database, use the command `npm run seed`. By default process.env.NODE_ENV is as development
  - To start the application and emulate AWS Lambda locally, use the command `npm run start`, it is assumed that you have installed all packages previously.
  - To run all test, use the command `npm run test`, it is assumed that you have previously started the application with the previous command.
- The entire Postman collection is published in: https://documenter.getpostman.com/view/12948957/TzJx8wPy

## Final notes

Below are all the endpoints deployed through AWS Lamda and API Gateway:
- GET - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors
- POST - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors
- GET - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}
- PATCH - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}
- DELETE - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}
- GET - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}/publications
- POST - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}/publications
- GET - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}/publications/{publicationId}
- PATCH - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}/publications/{publicationId}
- DELETE - https://o1pgajh7yb.execute-api.us-east-1.amazonaws.com/dev/authors/{authorId}/publications/{publicationId}

Just to clarify, some paths have relative variables like `authorID` which should be replace by an ID of an author, and `publicationId` which should be replace by an ID of an publication.

That would be all for now, thanks. 
