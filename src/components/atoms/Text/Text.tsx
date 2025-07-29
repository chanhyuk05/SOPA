import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const Text: React.FC<CustomTextProps> = ({ 
  children,
  variant = 'body',
  color = '#000000',
  weight = 'normal',
  style,
  ...props 
}) => {
  return (
    <RNText 
      style={[
        styles.base,
        styles[variant],
        styles[weight],
        { color },
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  normal: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});

export default Text;
