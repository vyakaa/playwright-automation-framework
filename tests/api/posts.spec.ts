import { test, expect } from '@playwright/test';
import { PostsApiClient, Post } from '../../api/posts.api';

let postsApi: PostsApiClient;

test.beforeAll(async ({ playwright }) => {
  const context = await playwright.request.newContext();
  postsApi = new PostsApiClient(context);
});

test.describe('JSONPlaceholder Posts API - CRUD Operations', () => {
  test('should retrieve all posts', async () => {
    const response = await postsApi.getPosts();

    expect(response.status).toBe(200);
    postsApi.validateContentType(response.headers, 'application/json');
    expect(Array.isArray(response.data)).toBe(true);
    expect((response.data as Post[]).length).toBeGreaterThan(0);
  });

  test('should validate posts schema structure', async () => {
    const response = await postsApi.getPosts();

    expect(response.status).toBe(200);

    (response.data as Post[]).forEach((post) => {
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');

      expect(typeof post.userId).toBe('number');
      expect(typeof post.id).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');

      // Validate required fields are not empty
      expect(post.title).not.toHaveLength(0);
      expect(post.body).not.toHaveLength(0);
    });
  });

  test('should retrieve a specific post by id', async () => {
    const postId = 1;
    const response = await postsApi.getPostById(postId);

    expect(response.status).toBe(200);
    postsApi.validateContentType(response.headers, 'application/json');

    const post = response.data as Post;
    expect(post.id).toBe(postId);
    postsApi.validateSchema<Post>(post, ['userId', 'id', 'title', 'body']);
  });

  test('should not return non-existent post', async () => {
    const nonExistentId = 999999;
    const response = await postsApi.getPostById(nonExistentId);

    expect(response.status).toBe(404);
  });

  test('should retrieve posts filtered by userId', async () => {
    const userId = 1;
    const response = await postsApi.getPostsByUserId(userId);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);

    (response.data as Post[]).forEach((post) => {
      expect(post.userId).toBe(userId);
    });
  });

  test('should create a new post', async () => {
    const newPost: Post = {
      userId: 1,
      title: 'Test Post Title',
      body: 'This is a test post body for testing purposes.',
    };

    const response = await postsApi.createPost(newPost);

    expect(response.status).toBe(201);
    postsApi.validateContentType(response.headers, 'application/json');

    const createdPost = response.data as Post;
    expect(createdPost.title).toBe(newPost.title);
    expect(createdPost.body).toBe(newPost.body);
    expect(createdPost.userId).toBe(newPost.userId);
    expect(createdPost.id).toBeDefined();
  });

  test('should validate created post schema', async () => {
    const newPost: Post = {
      userId: 2,
      title: 'Schema Test Post',
      body: 'Testing schema validation for created post.',
    };

    const response = await postsApi.createPost(newPost);

    expect(response.status).toBe(201);

    const createdPost = response.data as Post;
    postsApi.validateSchema<Post>(createdPost, ['userId', 'id', 'title', 'body']);
  });

  test('should update an existing post', async () => {
    const postIdToUpdate = 1;

    const updatedData: Partial<Post> = {
      title: 'Updated Post Title',
      body: 'This is the updated post body.',
    };

    const response = await postsApi.updatePost(postIdToUpdate, updatedData);

    expect(response.status).toBe(200);
    postsApi.validateContentType(response.headers, 'application/json');

    const updatedPost = response.data as Post;
    expect(updatedPost.title).toBe(updatedData.title);
    expect(updatedPost.body).toBe(updatedData.body);
  });

  test('should partially update a post', async () => {
    const newPost: Post = {
      userId: 4,
      title: 'Post to Patch',
      body: 'This post will be patched.',
    };
    const createResponse = await postsApi.createPost(newPost);
    const postIdToPatch = (createResponse.data as Post).id!;

    const patchData: Partial<Post> = {
      title: 'Patched Title Only',
    };

    const response = await postsApi.partialUpdatePost(postIdToPatch, patchData);

    expect(response.status).toBe(200);

    const patchedPost = response.data as Post;
    expect(patchedPost.title).toBe(patchData.title);
  });

  test('should delete a post', async () => {
    const newPost: Post = {
      userId: 5,
      title: 'Post to Delete',
      body: 'This post will be deleted.',
    };

    const createResponse = await postsApi.createPost(newPost);
    const postIdToDelete = (createResponse.data as Post).id!;

    const deleteResponse = await postsApi.deletePost(postIdToDelete);

    expect(deleteResponse.status).toBe(200);
  });

  test('should verify post title and body are not empty', async () => {
    const response = await postsApi.getPosts();

    (response.data as Post[]).slice(0, 5).forEach((post) => {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.body.length).toBeGreaterThan(0);
    });
  });

  test('should verify all retrieved posts have valid userId', async () => {
    const response = await postsApi.getPosts();

    (response.data as Post[]).forEach((post) => {
      expect(post.userId).toBeGreaterThan(0);
    });
  });
});
