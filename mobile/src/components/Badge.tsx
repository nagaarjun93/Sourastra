import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'source';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary' }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryBadge;
      case 'success':
        return styles.successBadge;
      case 'source':
        return styles.sourceBadge;
      default:
        return styles.primaryBadge;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'success':
        return styles.successText;
      case 'source':
        return styles.sourceText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={[styles.text, getTextStyle()]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  primaryBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
  },
  primaryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
  },
  secondaryText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '600',
  },
  successBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  successText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
  },
  sourceBadge: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    borderWidth: 1,
  },
  sourceText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
  text: {
    fontSize: 12,
  },
});
