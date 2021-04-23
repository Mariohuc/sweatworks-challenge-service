const authorFactory = require('./factories/author');
// Give me a user with all the defaults
(async () => {
  const user1 = await authorFactory.create();
  console.log(user1.id);
  // Give me a user with a specific first name
  const user2 = await authorFactory.create();
  console.log(user2.id);

  return;
})()