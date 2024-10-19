# API Routes Documentation

## User Routes

- **POST** `https://backend2.vaibhavpal9935.workers.dev/api/v1/user/signup`  
  Register a new user.

- **POST** `https://backend2.vaibhavpal9935.workers.dev/api/v1/user/signin`  
  Log in an existing user.

- **GET** `https://backend2.vaibhavpal9935.workers.dev/api/v1/user/profile/:query`  
  Retrieve a specific user's details.

- **PUT** `https://backend2.vaibhavpal9935.workers.dev/api/v1/user/update`  
  Update a user's information.

- **PUT** `https://backend2.vaibhavpal9935.workers.dev/api/v1/user/freeze`  
  Freeze a user's account.

- **POST** `https://backend2.vaibhavpal9935.workers.dev/api/v1/user/follow/:id`  
  Follow or Unfollow a specific user.

## Post Routes

- **POST** `https://backend2.vaibhavpal9935.workers.dev/api/v1/post/create`  
  Create a new post.

- **GET** `https://backend2.vaibhavpal9935.workers.dev/api/v1/post/:id`  
  Retrieve a specific post.

- **DELETE** `https://backend2.vaibhavpal9935.workers.dev/api/v1/post/delete/:id`  
  Delete a specific post.

- **GET** `https://backend2.vaibhavpal9935.workers.dev/api/v1/post/user/:username`  
  Retrieve all the posts made by a user.

  
## Feed Routes

- **GET** `https://backend2.vaibhavpal9935.workers.dev/api/v1/post/feed`  
  Retrieve posts from users that the logged-in user follows.

## Like Routes

- **PUT** `https://backend2.vaibhavpal9935.workers.dev/api/v1/post/like/:id`  
  Like or Unlike a post.

## Reply Routes

- **PUT** `https://backend2.vaibhavpal9935.workers.dev/api/v1/post/reply/:id`  
  Add a reply to a post.






