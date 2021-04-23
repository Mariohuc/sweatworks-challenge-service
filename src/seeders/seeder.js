const authorFactory = require('./factories/factories');
// Give me a user with all the defaults
(async () => {
  // three times - 3 authors and 5 posts by each author created
  for(let i=0; i < 3; i++) await authorFactory.createAuthorWithPosts(); 

  return;
})()