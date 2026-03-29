'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Star,
  StarBorder,
  Home,
  Work,
  LocationOn,
} from '@mui/icons-material';
import { TextField as CustomTextField, Button as CustomButton, Card as CustomCard, Navbar } from '../../../modules/shared/components';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '../../../modules/addresses';
import { addressSchema, AddressInput } from '../../../modules/shared/schemas/address.schema';

export default function AddressesPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Queries y mutations
  const { data: addresses, isLoading } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  // Form para crear/editar dirección
  const addressForm = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      fullAddress: '',
      city: '',
      postalCode: '',
      isDefault: false,
    },
  });

  // Check auth status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('auth-storage');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (!token || !parsed?.state?.user) {
            router.push('/landing');
          }
        } catch {
          router.push('/landing');
        }
      } else {
        router.push('/landing');
      }
      setAuthChecked(true);
    }
  }, [router]);

  // Reset form when editing
  useEffect(() => {
    if (editingAddress) {
      addressForm.reset({
        label: editingAddress.label,
        fullAddress: editingAddress.fullAddress,
        city: editingAddress.city,
        postalCode: editingAddress.postalCode,
        isDefault: editingAddress.isDefault,
      });
    } else {
      addressForm.reset({
        label: '',
        fullAddress: '',
        city: '',
        postalCode: '',
        isDefault: addresses?.length === 0 || false,
      });
    }
  }, [editingAddress, addressForm, addresses]);

  const handleOpenDialog = (address?: any) => {
    setEditingAddress(address || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (data: AddressInput) => {
    try {
      if (editingAddress) {
        await updateMutation.mutateAsync({ id: editingAddress.id, data });
        enqueueSnackbar('Dirección actualizada correctamente', { variant: 'success' });
      } else {
        await createMutation.mutateAsync(data);
        enqueueSnackbar('Dirección creada correctamente', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || 'Error al guardar la dirección', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!addressToDelete) return;
    try {
      await deleteMutation.mutateAsync(addressToDelete);
      enqueueSnackbar('Dirección eliminada correctamente', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || 'Error al eliminar la dirección', { variant: 'error' });
    }
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultMutation.mutateAsync(id);
      enqueueSnackbar('Dirección predeterminada actualizada', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error?.response?.data?.message || 'Error al establecer la dirección predeterminada', { variant: 'error' });
    }
  };

  const getLabelIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('casa') || lowerLabel.includes('home')) return <Home />;
    if (lowerLabel.includes('trabajo') || lowerLabel.includes('oficina') || lowerLabel.includes('work')) return <Work />;
    return <LocationOn />;
  };

  // Loading state
  if (!authChecked || isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const hasAddresses = addresses && addresses.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <Navbar showBackButton backButtonHref="/profile" />

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Mis Direcciones
        </Typography>

        {/* Empty State */}
        {!hasAddresses ? (
          <CustomCard sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <LocationOn sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                No hay direcciones guardadas
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Gestiona tus direcciones de envío para un checkout más rápido
              </Typography>
              <CustomButton
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Agregar Dirección
              </CustomButton>
            </CardContent>
          </CustomCard>
        ) : (
          <>
            {/* Header con botón agregar */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <CustomButton
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Agregar Dirección
              </CustomButton>
            </Box>

            {/* Cards de direcciones */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {addresses?.map((address) => (
                <CustomCard key={address.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Box sx={{ color: 'primary.main' }}>
                          {getLabelIcon(address.label)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6">
                              {address.label}
                            </Typography>
                            {address.isDefault && (
                              <Chip
                                icon={<Star />}
                                label="Predeterminada"
                                color="primary"
                                size="small"
                              />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                            {address.fullAddress}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {address.city}, {address.postalCode}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!address.isDefault && (
                          <IconButton
                            color="warning"
                            onClick={() => handleSetDefault(address.id)}
                            title="Establecer como predeterminada"
                          >
                            <StarBorder />
                          </IconButton>
                        )}
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(address)}
                          title="Editar"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setAddressToDelete(address.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Eliminar"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </CustomCard>
              ))}
            </Box>
          </>
        )}
      </Container>

      {/* Dialog para crear/editar dirección */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <CustomTextField
                label="Etiqueta"
                placeholder="Ej: Casa, Trabajo, Oficina"
                registration={addressForm.register('label')}
                error={addressForm.formState.errors.label}
              />
              <CustomTextField
                label="Dirección completa"
                placeholder="Calle, número, zona y referencias"
                registration={addressForm.register('fullAddress')}
                error={addressForm.formState.errors.fullAddress}
                multiline
                rows={3}
              />
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <CustomTextField
                  label="Ciudad"
                  registration={addressForm.register('city')}
                  error={addressForm.formState.errors.city}
                />
                <CustomTextField
                  label="Código Postal"
                  registration={addressForm.register('postalCode')}
                  error={addressForm.formState.errors.postalCode}
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={addressForm.watch('isDefault')}
                    onChange={(e) => addressForm.setValue('isDefault', e.target.checked)}
                    color="primary"
                  />
                }
                label="Establecer como dirección predeterminada"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <CustomButton
            onClick={addressForm.handleSubmit(handleSubmit)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {editingAddress ? 'Guardar Cambios' : 'Crear Dirección'}
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <CustomButton
            color="error"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
          >
            Eliminar
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
