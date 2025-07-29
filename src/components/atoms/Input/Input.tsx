import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

const Input: React.FC<InputProps> = ({ 
  variant = 'default', 
  size = 'medium',
  style,
  ...props 
}) => {
  return (
    <View style={[styles.container, styles[variant], styles[size]]}>
      <TextInput 
        style={[styles.input, style]}
        placeholderTextColor="#8E8E93"
        {...props} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  default: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  filled: {
    backgroundColor: '#F2F2F7',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 16,
    color: '#000000',
  },
});

export default Input;
