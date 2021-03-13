const express = require('express');
const tagsRouter = express.Router();
const { getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const tagName = req.params.tagName;
  try {
    // use our method to get posts by tag name from the db
    const tagPosts = await getPostsByTagName(tagName);
    // send out an object to the client { posts: // the posts }
    const tagPostsFiltered = tagPosts.filter(post => {
      return post.active || (req.user && post.author.id === req.user.id);
    });
    res.send({
      posts: tagPostsFiltered
    });
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message });
  }
});


module.exports = tagsRouter;