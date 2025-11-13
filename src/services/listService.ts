import apiClient from './api';
import type { List, CreateListInput, UpdateListInput, ApiResponse } from '../types';

export const listService = {
  async getAll(): Promise<List[]> {
    const response = await apiClient.get<ApiResponse<List[]>>('/lists');
    return response.data.data;
  },

  async getById(id: string): Promise<List> {
    const response = await apiClient.get<ApiResponse<List>>(`/lists/${id}`);
    return response.data.data;
  },

  async create(input: CreateListInput): Promise<List> {
    const response = await apiClient.post<ApiResponse<List>>('/lists', input);
    return response.data.data;
  },

  async update(id: string, input: UpdateListInput): Promise<List> {
    const response = await apiClient.put<ApiResponse<List>>(`/lists/${id}`, input);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/lists/${id}`);
  },
};

