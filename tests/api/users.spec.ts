import { test, expect } from '@playwright/test';
import { UsersApiClient, User } from '../../api/users.api';

let usersApi: UsersApiClient;

test.beforeAll(async ({ playwright }) => {
  const context = await playwright.request.newContext();
  usersApi = new UsersApiClient(context);
});

test.describe('JSONPlaceholder Users API - CRUD Operations', () => {
  test('should retrieve all users', async () => {
    const response = await usersApi.getUsers();

    expect(response.status).toBe(200);
    usersApi.validateContentType(response.headers, 'application/json');
    expect(Array.isArray(response.data)).toBe(true);
    expect((response.data as User[]).length).toBeGreaterThan(0);
  });

  test('should validate users schema structure', async () => {
    const response = await usersApi.getUsers();

    expect(response.status).toBe(200);

    (response.data as User[]).forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');

      expect(typeof user.id).toBe('number');
      expect(typeof user.name).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.email).toBe('string');

      // Validate required fields are not empty
      expect(user.name).not.toHaveLength(0);
      expect(user.username).not.toHaveLength(0);
      expect(user.email).not.toHaveLength(0);
    });
  });

  test('should validate users email format', async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const response = await usersApi.getUsers();

    (response.data as User[]).forEach((user) => {
      expect(user.email).toMatch(emailRegex);
    });
  });

  test('should retrieve a specific user by id', async () => {
    const userId = 1;
    const response = await usersApi.getUserById(userId);

    expect(response.status).toBe(200);
    usersApi.validateContentType(response.headers, 'application/json');

    const user = response.data as User;
    expect(user.id).toBe(userId);
    usersApi.validateSchema<User>(user, ['id', 'name', 'username', 'email']);
  });

  test('should not return non-existent user', async () => {
    const nonExistentId = 999999;
    const response = await usersApi.getUserById(nonExistentId);

    expect(response.status).toBe(404);
  });

  test('should create a new user', async () => {
    const newUser: User = {
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@example.com',
      phone: '+1-555-0100',
      website: 'https://example.com',
    };

    const response = await usersApi.createUser(newUser);

    expect(response.status).toBe(201);
    usersApi.validateContentType(response.headers, 'application/json');

    const createdUser = response.data as User;
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.id).toBeDefined();
  });

  test('should validate created user schema', async () => {
    const newUser: User = {
      name: 'Schema Test User',
      username: 'schematestuser',
      email: 'schematest@example.com',
    };

    const response = await usersApi.createUser(newUser);

    expect(response.status).toBe(201);

    const createdUser = response.data as User;
    usersApi.validateSchema<User>(createdUser, ['id', 'name', 'username', 'email']);
  });

  test('should update an existing user', async () => {
    const userIdToUpdate = 1;

    const updatedData: Partial<User> = {
      name: 'Updated User Name',
      email: 'updated@example.com',
    };

    const response = await usersApi.updateUser(userIdToUpdate, updatedData);

    expect(response.status).toBe(200);
    usersApi.validateContentType(response.headers, 'application/json');

    const updatedUser = response.data as User;
    expect(updatedUser.name).toBe(updatedData.name);
    expect(updatedUser.email).toBe(updatedData.email);
  });

  test('should partially update a user', async () => {
    const newUser: User = {
      name: 'User to Patch',
      username: 'userpatch',
      email: 'userpatch@example.com',
    };
    const createResponse = await usersApi.createUser(newUser);
    const userIdToPatch = (createResponse.data as User).id!;

    const patchData: Partial<User> = {
      phone: '+1-555-0200',
    };

    const response = await usersApi.partialUpdateUser(userIdToPatch, patchData);

    expect(response.status).toBe(200);

    const patchedUser = response.data as User;
    expect(patchedUser.phone).toBe(patchData.phone);
  });

  test('should delete a user', async () => {
    const newUser: User = {
      name: 'User to Delete',
      username: 'userdelete',
      email: 'userdelete@example.com',
    };

    const createResponse = await usersApi.createUser(newUser);
    const userIdToDelete = (createResponse.data as User).id!;

    const deleteResponse = await usersApi.deleteUser(userIdToDelete);

    expect(deleteResponse.status).toBe(200);
  });

  test('should verify all users have unique ids', async () => {
    const response = await usersApi.getUsers();

    const userIds = (response.data as User[]).map((u) => u.id);
    const uniqueIds = new Set(userIds);

    expect(uniqueIds.size).toBe(userIds.length);
  });

  test('should verify all users have non-empty names', async () => {
    const response = await usersApi.getUsers();

    (response.data as User[]).forEach((user) => {
      expect(user.name.length).toBeGreaterThan(0);
    });
  });
});
