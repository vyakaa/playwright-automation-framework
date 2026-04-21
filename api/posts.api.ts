import { APIRequestContext } from '@playwright/test';
import { BaseApiClient, ApiResponse } from './base.api';

export interface Post {
  userId: number;
  id?: number;
  title: string;
  body: string;
}

export class PostsApiClient extends BaseApiClient {
  private readonly endpoint = '/posts';

  constructor(
    context: APIRequestContext,
    baseURL: string = 'https://jsonplaceholder.typicode.com',
  ) {
    super(context, baseURL);
  }

  async getPosts(): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>(this.endpoint);
  }

  async getPostById(id: number): Promise<ApiResponse<Post>> {
    return this.get<Post>(`${this.endpoint}/${id}`);
  }

  async getPostsByUserId(userId: number): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>(`${this.endpoint}?userId=${userId}`);
  }

  async createPost(post: Post): Promise<ApiResponse<Post>> {
    return this.post<Post>(this.endpoint, post);
  }

  async updatePost(id: number, post: Partial<Post>): Promise<ApiResponse<Post>> {
    return this.put<Post>(`${this.endpoint}/${id}`, post);
  }

  async partialUpdatePost(id: number, post: Partial<Post>): Promise<ApiResponse<Post>> {
    return this.patch<Post>(`${this.endpoint}/${id}`, post);
  }

  async deletePost(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
