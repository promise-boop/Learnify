import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputLabel = styled.label`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #525f7f;
`;

const InputBase = styled.input`
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  border: 1px solid ${props => props.error ? '#f5365c' : '#dee2e6'};
  border-radius: 0.375rem;
  color: #32325d;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #5e72e4;
    box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.15);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

const InputAdornment = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'start' ? 'left: 0.75rem;' : 'right: 0.75rem;'}
  color: #8898aa;
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  
  ${props => props.hasStartAdornment && css`
    ${InputBase} {
      padding-left: 2.5rem;
    }
  `}
  
  ${props => props.hasEndAdornment && css`
    ${InputBase} {
      padding-right: 2.5rem;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #f5365c;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Input = forwardRef(({
  label,
  error,
  fullWidth = true,
  startAdornment,
  endAdornment,
  ...props
}, ref) => {
  return (
    <InputContainer>
      {label && <InputLabel>{label}</InputLabel>}
      <InputWrapper 
        hasStartAdornment={!!startAdornment}
        hasEndAdornment={!!endAdornment}
      >
        {startAdornment && (
          <InputAdornment position="start">
            {startAdornment}
          </InputAdornment>
        )}
        <InputBase
          ref={ref}
          error={error}
          fullWidth={fullWidth}
          {...props}
        />
        {endAdornment && (
          <InputAdornment position="end">
            {endAdornment}
          </InputAdornment>
        )}
      </InputWrapper>
      {error && typeof error === 'string' && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;