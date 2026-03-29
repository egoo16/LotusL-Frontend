'use client';

import { forwardRef } from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

/**
 * TextField - Simple wrapper around MUI TextField
 * Use with react-hook-form's register() - NO Controller needed for basic inputs
 *
 * Usage:
 *   <TextField
 *     label="Email"
 *     registration={register('email')}
 *     error={errors.email}
 *   />
 */
export interface TextFieldProps extends Omit<MuiTextFieldProps, 'error' | 'helperText'> {
  /** Field registration from react-hook-form's register() */
  registration?: Partial<Pick<UseFormRegisterReturn, 'ref' | 'onChange' | 'onBlur' | 'name'>>;
  /** Error object from react-hook-form (e.g., errors.email) */
  error?: { message?: string };
  /** Custom helper text (overrides error message) */
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ registration, error, helperText, label, ...props }, ref) => {
    return (
      <MuiTextField
        inputRef={(el) => {
          // Handle both forwardRef and form registration ref
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
          }
          // Connect to react-hook-form
          if (registration?.ref) {
            (registration.ref as (el: HTMLInputElement | null) => void)(el);
          }
        }}
        onChange={registration?.onChange}
        onBlur={registration?.onBlur}
        name={registration?.name}
        label={label}
        error={!!error?.message}
        helperText={error?.message || helperText}
        fullWidth
        variant="outlined"
        {...props}
      />
    );
  },
);

TextField.displayName = 'TextField';
