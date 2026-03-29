import { z } from 'zod';

export const addressSchema = z.object({
  label: z
    .string()
    .min(1, 'La etiqueta es requerida')
    .max(100, 'La etiqueta no puede exceder 100 caracteres'),
  fullAddress: z
    .string()
    .min(1, 'La dirección completa es requerida')
    .max(500, 'La dirección no puede exceder 500 caracteres'),
  city: z
    .string()
    .min(1, 'La ciudad es requerida')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  postalCode: z
    .string()
    .min(1, 'El código postal es requerido')
    .max(20, 'El código postal no puede exceder 20 caracteres'),
  isDefault: z.boolean().optional().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
