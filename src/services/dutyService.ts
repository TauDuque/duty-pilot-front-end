import apiClient from './api';
import type { Duty, CreateDutyInput, UpdateDutyInput, ApiResponse } from '../types';

export const dutyService = {
  async getAll(): Promise<Duty[]> {
    const response = await apiClient.get<ApiResponse<Duty[]>>('/duties');
    return response.data.data;
  },

  async getById(id: string): Promise<Duty> {
    const response = await apiClient.get<ApiResponse<Duty>>(`/duties/${id}`);
    return response.data.data;
  },

  async create(input: CreateDutyInput): Promise<Duty> {
    const response = await apiClient.post<ApiResponse<Duty>>('/duties', input);
    return response.data.data;
  },

  async update(id: string, input: UpdateDutyInput): Promise<Duty> {
    const response = await apiClient.put<ApiResponse<Duty>>(`/duties/${id}`, input);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/duties/${id}`);
  },
};
