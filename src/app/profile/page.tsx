'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  BrightnessAuto,
  Logout,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Save,
} from '@mui/icons-material';
import { useThemeStore } from '../../modules/shared/store';
import { useAuthStore } from '../../modules/shared/store/authStore';
import { TextField as CustomTextField, Button as CustomButton, Card as CustomCard } from '../../modules/shared/components';
import { useProfile, useUpdateProfile, useChangePassword } from '../../modules/auth/hooks/useAuth';
import { profileSchema, changePasswordSchema, ProfileInput, ChangePasswordInput } from '../../modules/shared/schemas/auth.schema';

export default function ProfilePage() {
  const router = useRouter();
  const { mode, setMode } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentAuth, setCurrentAuth] = useState({ isAuthenticated: false, user: null as any });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Fetch profile data
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // Profile form
  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      birthDate: '',
      phone: '',
      location: '',
      twitterHandle: '',
      instagramHandle: '',
    },
  });

  // Password change form
  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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
          setCurrentAuth({
            isAuthenticated: !!token && !!parsed?.state?.user,
            user: parsed?.state?.user || null,
          });
        } catch {
          setCurrentAuth({ isAuthenticated: false, user: null });
        }
      } else {
        setCurrentAuth({ isAuthenticated: false, user: null });
      }
      setAuthChecked(true);
    }
  }, []);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || '',
        birthDate: profile.birthDate || '',
        phone: profile.phone || '',
        location: profile.location || '',
        twitterHandle: profile.twitterHandle || '',
        instagramHandle: profile.instagramHandle || '',
      });
    }
  }, [profile, profileForm]);

  // Redirect if not authenticated
  useEffect(() => {
    if (authChecked && !currentAuth.isAuthenticated) {
      router.push('/landing');
    }
  }, [authChecked, currentAuth.isAuthenticated, router]);

  // Handlers
  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeAnchorEl(null);
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleThemeMenuClose();
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/landing';
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onProfileSubmit = async (data: ProfileInput) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateProfileMutation.mutateAsync(data);
      setSuccessMessage('Perfil actualizado correctamente');
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordInput) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await changePasswordMutation.mutateAsync(data);
      setSuccessMessage('Contraseña cambiada correctamente');
      passwordForm.reset();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Error al cambiar la contraseña');
    }
  };

  const themeIcon = {
    light: <Brightness7 />,
    dark: <Brightness4 />,
    system: <BrightnessAuto />,
  }[mode];

  // Loading state
  if (!authChecked || isLoadingProfile) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton onClick={() => router.push('/')} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LotusL
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <IconButton onClick={handleThemeMenuOpen} color="inherit">
                {themeIcon}
              </IconButton>
              <Menu
                anchorEl={themeAnchorEl}
                open={Boolean(themeAnchorEl)}
                onClose={handleThemeMenuClose}
              >
                <MenuItem onClick={() => handleThemeChange('light')}>
                  <Brightness7 sx={{ mr: 1 }} /> Claro
                </MenuItem>
                <MenuItem onClick={() => handleThemeChange('dark')}>
                  <Brightness4 sx={{ mr: 1 }} /> Oscuro
                </MenuItem>
                <MenuItem onClick={() => handleThemeChange('system')}>
                  <BrightnessAuto sx={{ mr: 1 }} /> Sistema
                </MenuItem>
              </Menu>

              <Button
                onClick={handleUserMenuOpen}
                startIcon={
                  <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                    {currentAuth.user?.firstName?.[0] || currentAuth.user?.email?.[0] || 'U'}
                  </Avatar>
                }
              >
                {currentAuth.user?.firstName || currentAuth.user?.email?.split('@')[0]}
              </Button>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Content */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Mi Perfil
        </Typography>

        {/* Messages */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}

        {/* Profile Info */}
        <CustomCard sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Información Personal
            </Typography>
            <Box component="form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate>
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <CustomTextField
                  label="Nombre"
                  registration={profileForm.register('firstName')}
                  error={profileForm.formState.errors.firstName}
                />
                <CustomTextField
                  label="Apellido"
                  registration={profileForm.register('lastName')}
                  error={profileForm.formState.errors.lastName}
                />
                <CustomTextField
                  label="Correo electrónico"
                  value={profile?.email || ''}
                  disabled
                  helperText="El correo no se puede cambiar"
                  sx={{ gridColumn: { sm: 'span 2' } }}
                />
                <CustomTextField
                  label="Fecha de nacimiento"
                  type="date"
                  registration={profileForm.register('birthDate')}
                  error={profileForm.formState.errors.birthDate}
                  InputLabelProps={{ shrink: true }}
                  sx={{ gridColumn: { sm: 'span 2' } }}
                />
                <CustomTextField
                  label="Teléfono"
                  registration={profileForm.register('phone')}
                  error={profileForm.formState.errors.phone}
                />
                <CustomTextField
                  label="Ubicación"
                  registration={profileForm.register('location')}
                  error={profileForm.formState.errors.location}
                />
                <CustomTextField
                  label="Biografía"
                  registration={profileForm.register('bio')}
                  error={profileForm.formState.errors.bio}
                  multiline
                  rows={3}
                  sx={{ gridColumn: { sm: 'span 2' } }}
                />
                <CustomTextField
                  label="Twitter"
                  registration={profileForm.register('twitterHandle')}
                  error={profileForm.formState.errors.twitterHandle}
                  placeholder="@usuario"
                />
                <CustomTextField
                  label="Instagram"
                  registration={profileForm.register('instagramHandle')}
                  error={profileForm.formState.errors.instagramHandle}
                  placeholder="@usuario"
                />
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <CustomButton
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  isLoading={updateProfileMutation.isPending}
                >
                  Guardar Cambios
                </CustomButton>
              </Box>
            </Box>
          </CardContent>
        </CustomCard>

        {/* Password Change */}
        <CustomCard>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Cambiar Contraseña
            </Typography>
            {profile?.provider === 'google' ? (
              <Alert severity="info">
                Tu cuenta está vinculada con Google. No necesitas establecer una contraseña.
              </Alert>
            ) : (
              <Box component="form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} noValidate>
                <Box sx={{ display: 'grid', gap: 3 }}>
                  <CustomTextField
                    label="Contraseña actual"
                    type={showPasswords.current ? 'text' : 'password'}
                    registration={passwordForm.register('currentPassword')}
                    error={passwordForm.formState.errors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => toggleShowPassword('current')} edge="end">
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <CustomTextField
                    label="Nueva contraseña"
                    type={showPasswords.new ? 'text' : 'password'}
                    registration={passwordForm.register('newPassword')}
                    error={passwordForm.formState.errors.newPassword}
                    helperText="Mínimo 8 caracteres, una mayúscula y un número"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => toggleShowPassword('new')} edge="end">
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <CustomTextField
                    label="Confirmar nueva contraseña"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    registration={passwordForm.register('confirmPassword')}
                    error={passwordForm.formState.errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => toggleShowPassword('confirm')} edge="end">
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <CustomButton
                    type="submit"
                    variant="contained"
                    color="secondary"
                    startIcon={<Save />}
                    isLoading={changePasswordMutation.isPending}
                  >
                    Cambiar Contraseña
                  </CustomButton>
                </Box>
              </Box>
            )}
          </CardContent>
        </CustomCard>
      </Container>
    </Box>
  );
}
