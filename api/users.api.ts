import { APIRequestContext } from '@playwright/test';
import { BaseApiClient, ApiResponse } from './base.api';

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export class UsersApiClient extends BaseApiClient {
  private readonly endpoint = '/users';

  constructor(
    context: APIRequestContext,
    baseURL: string = 'https://jsonplaceholder.typicode.com',
  ) {
    super(context, baseURL);
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(this.endpoint);
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.get<User>(`${this.endpoint}/${id}`);
  }

  async createUser(user: User): Promise<ApiResponse<User>> {
    return this.post<User>(this.endpoint, user);
  }

  async updateUser(id: number, user: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(`${this.endpoint}/${id}`, user);
  }

  async partialUpdateUser(id: number, user: Partial<User>): Promise<ApiResponse<User>> {
    return this.patch<User>(`${this.endpoint}/${id}`, user);
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
