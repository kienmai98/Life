// Black & White Monochrome Theme
export const monochromeTheme = {
  colors: {
    black: '#000000',
    white: '#FFFFFF',
    gray100: '#F5F5F5',
    gray200: '#E0E0E0',
    gray300: '#C0C0C0',
    gray400: '#888888',
    gray500: '#555555',
    gray600: '#333333',
  },
  
  // Common styles
  styles: {
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    
    // Cards
    card: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#000000',
      borderRadius: 0,
      padding: 20,
      marginBottom: 16,
    },
    
    // Typography
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000000',
      letterSpacing: -0.5,
    },
    
    subtitle: {
      fontSize: 16,
      color: '#555555',
    },
    
    label: {
      fontSize: 11,
      fontWeight: '700',
      color: '#555555',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    
    body: {
      fontSize: 15,
      color: '#000000',
    },
    
    // Inputs
    input: {
      borderWidth: 2,
      borderColor: '#000000',
      borderRadius: 0,
      padding: 16,
      fontSize: 16,
      backgroundColor: '#FFFFFF',
      color: '#000000',
    },
    
    // Buttons
    buttonPrimary: {
      backgroundColor: '#000000',
      borderRadius: 0,
      padding: 16,
      alignItems: 'center',
    },
    
    buttonPrimaryText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    
    buttonSecondary: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#000000',
      borderRadius: 0,
      padding: 16,
      alignItems: 'center',
    },
    
    buttonSecondaryText: {
      color: '#000000',
      fontSize: 14,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    
    // Lists
    listItem: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
    },
    
    // Tab bar
    tabBar: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 2,
      borderTopColor: '#000000',
    },
    
    // Header
    header: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 2,
      borderBottomColor: '#000000',
    },
  },
};

export default monochromeTheme;
