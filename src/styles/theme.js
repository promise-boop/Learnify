const theme = {
  // Color palette
  colors: {
    // Primary brand colors
    primary: '#4361ee',
    primaryLight: '#4895ef',
    primaryDark: '#3a0ca3',
    
    // Secondary colors
    secondary: '#f72585',
    secondaryLight: '#ff5d8f',
    secondaryDark: '#b5179e',
    
    // Neutral shades
    background: '#f8f9fa',
    backgroundAlt: '#edf2f7',
    cardBackground: '#ffffff',
    inputBackground: '#ffffff',
    text: '#1a202c',
    textLight: '#718096',
    textMuted: '#a0aec0',
    headings: '#2d3748',
    border: '#e2e8f0',
    
    // Status colors
    success: '#10b981',
    successLight: '#d1fae5',
    successDark: '#059669',
    
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    warningDark: '#d97706',
    
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    dangerDark: '#dc2626',
    
    info: '#3b82f6',
    infoLight: '#dbeafe',
    infoDark: '#2563eb',
    
    // Education level colors
    igcse: '#4cc9f0',
    asLevel: '#4361ee',
    aLevel: '#3a0ca3',
    
    // UI specific colors
    codeBackground: '#f1f5f9',
    highlight: '#fffbeb',
    selection: '#bae6fd',
  },
  
  // Typography
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Roboto Mono', 'SF Mono', 'Fira Code', Consolas, monospace",
  },
  
  // Font sizes (in rem)
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    md: '1.125rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '1.875rem',
    '3xl': '2.25rem',
    '4xl': '3rem',
    '5xl': '4rem',
  },
  
  // Font weights
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Spacing
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  
  // Border radius
  borderRadius: '0.5rem',
  borderRadiusSm: '0.25rem',
  borderRadiusLg: '1rem',
  borderRadiusFull: '9999px',
  
  // Shadows
  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    small: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index values
  zIndices: {
    base: 0,
    elevated: 1,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
  },
  
  // Transitions
  transition: {
    fast: 'all 0.2s ease',
    default: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
  
  // Custom for education app
  subjects: {
    math: {
      color: '#4361ee',
      icon: 'Calculator',
    },
    physics: {
      color: '#4cc9f0',
      icon: 'AtomIcon',
    },
    biology: {
      color: '#10b981',
      icon: 'Leaf',
    },
    chemistry: {
      color: '#f72585',
      icon: 'Flask',
    },
    computerScience: {
      color: '#3a0ca3',
      icon: 'Code',
    },
    history: {
      color: '#f59e0b',
      icon: 'Clock',
    },
    geography: {
      color: '#10b981',
      icon: 'Globe',
    },
    accounting: {
      color: '#4361ee',
      icon: 'Calculator',
    },
    travelTourism: {
      color: '#4cc9f0',
      icon: 'Compass',
    },
    businessStudies: {
      color: '#3a0ca3',
      icon: 'Briefcase',
    },
  },
  
  // Credits system styling
  credits: {
    standard: {
      color: '#10b981',
      icon: 'CreditCard',
    },
    premium: {
      color: '#f59e0b',
      icon: 'Award',
    },
    unlimited: {
      color: '#4361ee',
      icon: 'Infinity',
    },
  },
};

export default theme;