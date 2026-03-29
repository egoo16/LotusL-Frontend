import { apiClient } from '../../shared/services/api';

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  label: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  label?: string;
  fullAddress?: string;
  city?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export const addressesService = {
  getAll: async (): Promise<Address[]> => {
    return apiClient.get<Address[]>('/addresses');
  },

  getById: async (id: string): Promise<Address> => {
    return apiClient.get<Address>(`/addresses/${id}`);
  },

  create: async (data: CreateAddressInput): Promise<Address> => {
    return apiClient.post<Address>('/addresses', data);
  },

  update: async (id: string, data: UpdateAddressInput): Promise<Address> => {
    return apiClient.patch<Address>(`/addresses/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string): Promise<Address> => {
    return apiClient.patch<Address>(`/addresses/${id}/default`, {});
  },
};
