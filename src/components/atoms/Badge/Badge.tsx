import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Text from '../../atoms/Text/Text';

interface BadgeProps extends ViewProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'grade1' | 'grade2' | 'grade3';
  size?: 'small' | 'medium' | 'large';
}

const Badge: React.FC<BadgeProps> = ({ 
  text,
  variant = 'info',
  size = 'medium',
  style,
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.badge, 
        styles[variant], 
        styles[size], 
        style
      ]} 
      {...props}
    >
      <Text 
        variant="caption" 
        color={styles[`${variant}Text`].color}
        weight="medium"
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  
  // Variants
  success: {
    backgroundColor: '#D4F6D4',
  },
  warning: {
    backgroundColor: '#FFF3CD',
  },
  error: {
    backgroundColor: '#F8D7DA',
  },
  info: {
    backgroundColor: '#D1ECF1',
  },
  grade1: {
    backgroundColor: '#FFE5E5', // 1학년 - 연한 빨강
  },
  grade2: {
    backgroundColor: '#E5F9F6', // 2학년 - 연한 청록
  },
  grade3: {
    backgroundColor: '#E5F4FD', // 3학년 - 연한 파랑
  },
  
  // Text colors
  successText: {
    color: '#155724',
  },
  warningText: {
    color: '#856404',
  },
  errorText: {
    color: '#721C24',
  },
  infoText: {
    color: '#0C5460',
  },
  grade1Text: {
    color: '#FF6B6B',
  },
  grade2Text: {
    color: '#4ECDC4',
  },
  grade3Text: {
    color: '#45B7D1',
  },
});

export default Badge;
