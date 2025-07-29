import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface IconProps extends ViewProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ 
  name,
  size = 24,
  color = '#000000',
  style,
  ...props 
}) => {
  // This is a placeholder icon component
  // In a real app, you would use react-native-vector-icons or similar
  return (
    <View 
      style={[
        styles.icon, 
        { 
          width: size, 
          height: size, 
          backgroundColor: color 
        }, 
        style
      ]} 
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: 2,
  },
});

export default Icon;
