import React from 'react';
import styled, { css } from 'styled-components';

const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'small' ? '0.5rem 1rem' : props.size === 'large' ? '0.75rem 1.5rem' : '0.625rem 1.25rem'};
  font-size: ${props => props.size === 'small' ? '0.875rem' : props.size === 'large' ? '1.125rem' : '1rem'};
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.variant === 'primary' && css`
    background-color: #5e72e4;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #4c5ce1;
    }
    
    &:active:not(:disabled) {
      background-color: #3a4bce;
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: white;
    color: #5e72e4;
    border: 1px solid #5e72e4;
    
    &:hover:not(:disabled) {
      background-color: #f8f9fa;
    }
    
    &:active:not(:disabled) {
      background-color: #edf2f7;
    }
  `}
  
  ${props => props.variant === 'text' && css`
    background-color: transparent;
    color: #5e72e4;
    border: none;
    padding: 0.25rem 0.5rem;
    
    &:hover:not(:disabled) {
      background-color: rgba(94, 114, 228, 0.1);
    }
    
    &:active:not(:disabled) {
      background-color: rgba(94, 114, 228, 0.2);
    }
  `}
  
  ${props => props.variant === 'danger' && css`
    background-color: #f5365c;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #ea2c54;
    }
    
    &:active:not(:disabled) {
      background-color: #d71a43;
    }
  `}
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...rest
}) => {
  return (
    <ButtonBase 
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </ButtonBase>
  );
};

export default Button;