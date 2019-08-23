import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ViewProps,
} from 'react-native';

import theme from '../../theme';

interface SeparatorProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

const Separator = ({ style, ...rest }: SeparatorProps) => {
  return <View {...rest} style={[styles.separator, style]} />;
};

export default Separator;

const styles = StyleSheet.create({
  separator: {
    height: theme.separatorHeight,
    backgroundColor: theme.separatorColor,
  },
});
