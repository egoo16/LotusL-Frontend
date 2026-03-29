import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const messages = {
  es: {
    common: {
      appName: 'LotusL',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Volver',
      next: 'Siguiente',
      previous: 'Anterior',
      search: 'Buscar',
      noResults: 'No se encontraron resultados',
    },
    nav: {
      home: 'Inicio',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      profile: 'Mi Perfil',
    },
    auth: {
      login: {
        title: 'Iniciar Sesión',
        email: 'Correo electrónico',
        password: 'Contraseña',
        submit: 'Iniciar Sesión',
        forgotPassword: '¿Olvidaste tu contraseña?',
        noAccount: '¿No tienes cuenta?',
        registerLink: 'Regístrate',
        googleButton: 'Continuar con Google',
      },
      register: {
        title: 'Crear Cuenta',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        submit: 'Registrarse',
        hasAccount: '¿Ya tienes cuenta?',
        loginLink: 'Inicia Sesión',
        passwordRequirements: 'Mínimo 8 caracteres, una mayúscula y un número',
      },
      forgotPassword: {
        title: 'Recuperar Contraseña',
        description: 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.',
        email: 'Correo electrónico',
        submit: 'Enviar Enlace',
        backToLogin: 'Volver a Iniciar Sesión',
        successMessage: 'Si el correo existe, recibirás un enlace de recuperación.',
      },
      resetPassword: {
        title: 'Nueva Contraseña',
        newPassword: 'Nueva Contraseña',
        confirmPassword: 'Confirmar Nueva Contraseña',
        submit: 'Restablecer Contraseña',
        successMessage: 'Contraseña actualizada correctamente.',
        errorMessage: 'El enlace ha expirado o es inválido.',
      },
      errors: {
        invalidCredentials: 'Credenciales inválidas',
        emailRequired: 'El correo es requerido',
        passwordRequired: 'La contraseña es requerida',
        passwordMismatch: 'Las contraseñas no coinciden',
        emailAlreadyExists: 'Este correo ya está registrado',
        invalidEmail: 'El correo no es válido',
        passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
        passwordRequirements: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
        firstNameRequired: 'El nombre es requerido',
        lastNameRequired: 'El apellido es requerido',
        invalidToken: 'El enlace ha expirado o es inválido',
        sessionExpired: 'Tu sesión ha expirado',
      },
    },
    landing: {
      hero: {
        title: 'Compra y vende libros de forma segura',
        subtitle: 'La plataforma donde los amantes de los libros encuentran tesoros literarios',
        cta: 'Explorar Libros',
      },
      howToBuy: {
        title: 'Cómo Comprar',
        step1: 'Explora nuestro catálogo de libros nuevos y usados',
        step2: 'Agrega tus favoritos al carrito',
        step3: 'Realiza el pago de forma segura',
        step4: 'Recibe tu libro en tu puerta',
      },
      howToSell: {
        title: 'Cómo Vender',
        step1: 'Publica los libros que ya no necesites',
        step2: 'Envíanos tus libros para inspección',
        step3: 'Recibe el pago cuando verifiquemos su estado',
      },
      howItWorks: {
        title: 'Cómo Funciona la Inspección',
        description: 'Todos los libros son inspectionados por nuestro equipo antes de ser enviados al comprador. Esto garantiza que recibas exactamente lo que esperas.',
        step1Title: 'Recepción',
        step1Desc: 'Recibimos tu libro en nuestras oficinas',
        step2Title: 'Verificación',
        step2Desc: 'Nuestro equipo verifica el estado del libro',
        step3Title: 'Almacenamiento',
        step3Desc: 'Guardamos tu libro hasta que sea vendido',
        step4Title: 'Envío',
        step4Desc: 'Enviamos el libro al comprador',
      },
      footer: {
        rights: 'Todos los derechos reservados',
        terms: 'Términos y Condiciones',
        privacy: 'Política de Privacidad',
        contact: 'Contacto',
      },
    },
    theme: {
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },
  },
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'es';

  return {
    locale,
    messages: messages[locale as Locale] || messages.es,
  };
});