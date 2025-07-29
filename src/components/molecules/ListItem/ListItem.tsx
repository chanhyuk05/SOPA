import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';

interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  showChevron?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ 
  title,
  subtitle,
  leftIcon,
  rightIcon,
  showChevron = false,
  style,
  ...props 
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      {leftIcon && (
        <Icon 
          name={leftIcon} 
          size={24} 
          color="#007AFF" 
          style={styles.leftIcon} 
        />
      )}
      
      <View style={styles.content}>
        <Text variant="body" weight="medium">{title}</Text>
        {subtitle && (
          <Text variant="caption" color="#8E8E93" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightIcon && (
        <Icon 
          name={rightIcon} 
          size={20} 
          color="#8E8E93" 
          style={styles.rightIcon} 
        />
      )}
      
      {showChevron && (
        <Icon 
          name="chevron-right" 
          size={16} 
          color="#C7C7CC" 
          style={styles.chevron} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  leftIcon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  rightIcon: {
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 8,
  },
});

export default ListItem;
