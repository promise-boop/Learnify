import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-secondary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-mono: 'Roboto Mono', 'SF Mono', 'Fira Code', Consolas, monospace;
    
    --scrollbar-width: 8px;
    --scrollbar-track: rgba(0, 0, 0, 0.05);
    --scrollbar-thumb: rgba(0, 0, 0, 0.2);
  }

  html, body {
    font-family: var(--font-primary);
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-secondary);
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.headings};
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
  }

  ul, ol {
    list-style-position: inside;
    margin-bottom: 1rem;
  }

  code {
    font-family: var(--font-mono);
    background-color: ${({ theme }) => theme.colors.codeBackground};
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    font-size: 0.9em;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: var(--scrollbar-width);
  }

  ::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: calc(var(--scrollbar-width) / 2);
  }

  /* App layout */
  .app-container {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  
  .page-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  /* Card styling */
  .card {
    background-color: ${({ theme }) => theme.colors.cardBackground};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadows.small};
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* Loading spinner */
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
  }

  /* Grid layouts */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  /* Form elements */
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius};
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    
    &:hover {
      transform: translateY(-1px);
    }
  }

  .btn-primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  .btn-secondary {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondaryDark};
    }
  }

  .btn-outline {
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.backgroundAlt};
    }
  }

  .btn-danger {
    background-color: ${({ theme }) => theme.colors.danger};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.dangerDark};
    }
  }

  .btn-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn-lg {
    padding: 1rem 1.75rem;
    font-size: 1.125rem;
  }

  /* Utilities */
  .text-center {
    text-align: center;
  }

  .mb-1 {
    margin-bottom: 0.5rem;
  }

  .mb-2 {
    margin-bottom: 1rem;
  }

  .mb-3 {
    margin-bottom: 1.5rem;
  }

  .mb-4 {
    margin-bottom: 2rem;
  }

  .mt-1 {
    margin-top: 0.5rem;
  }

  .mt-2 {
    margin-top: 1rem;
  }

  .mt-3 {
    margin-top: 1.5rem;
  }

  .mt-4 {
    margin-top: 2rem;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }
  
  .justify-center {
    justify-content: center;
  }

  .gap-1 {
    gap: 0.5rem;
  }

  .gap-2 {
    gap: 1rem;
  }

  .gap-3 {
    gap: 1.5rem;
  }

  .w-full {
    width: 100%;
  }

  /* Responsive */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.75rem;
    }

    h3 {
      font-size: 1.5rem;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .app-container {
      flex-direction: column;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    body {
      font-size: 14px;
    }

    .page-content {
      padding: 1rem;
    }
  }
`;