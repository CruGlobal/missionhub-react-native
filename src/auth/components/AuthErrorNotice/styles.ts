import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export const styles = StyleSheet.create({
  errorBar: {
    backgroundColor: '#FF5532',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: { ...theme.textRegular16, color: theme.white },
});
