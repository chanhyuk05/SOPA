import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import Text from '../../atoms/Text/Text';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  content?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  title,
  subtitle,
  content,
  onPress,
  children,
  style,
  ...props 
}) => {
  const CardContent = (
    <View style={[styles.card, style]} {...props}>
      {title && <Text variant="h3" weight="semibold" style={styles.title}>{title}</Text>}
      {subtitle && <Text variant="caption" color="#8E8E93" style={styles.subtitle}>{subtitle}</Text>}
      {content && <Text variant="body" style={styles.content}>{content}</Text>}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 8,
  },
  content: {
    lineHeight: 20,
  },
});

export default Card;
