'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressesService, Address, CreateAddressInput, UpdateAddressInput } from '../services/addresses.service';

// Hook para obtener todas las direcciones del usuario
export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      return addressesService.getAll();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para obtener una dirección por ID
export function useAddress(id: string) {
  return useQuery({
    queryKey: ['address', id],
    queryFn: async () => {
      return addressesService.getById(id);
    },
    enabled: !!id,
  });
}

// Hook para crear una dirección
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAddressInput) => {
      return addressesService.create(data);
    },
    onSuccess: () => {
      // Invalidar el query cache para recargar las direcciones
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

// Hook para actualizar una dirección
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAddressInput }) => {
      return addressesService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

// Hook para eliminar una dirección
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return addressesService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

// Hook para establecer una dirección como predeterminada
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return addressesService.setDefault(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}
