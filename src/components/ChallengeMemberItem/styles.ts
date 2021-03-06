import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  row: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: theme.fullWidth,
  },
  nameText: {
    ...theme.textRegular16,
    color: theme.accentColor,
  },
  date: {
    ...theme.textRegular12,
    color: theme.lightGrey,
  },
  card: {
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 6,
    borderRadius: 8,
    marginVertical: 4,
  },
});
