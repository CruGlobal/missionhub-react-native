import { StyleSheet } from 'react-native';

import theme, { TEXT_STYLES } from '../../../../theme';

export const styles = StyleSheet.create({
  socialButton: {
    width: '100%',
    height: 50,
    margin: 4,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
  },
  socialButtonText: {
    ...TEXT_STYLES.REGULAR_16,
    color: theme.white,
  },
});
