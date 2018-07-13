import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  time: {
    color: theme.inactiveColor,
    fontSize: 10,
  },
  message: {
    color: theme.textColor,
    fontSize: 14,
  },
  row: {
    marginHorizontal: 15,
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 13,
    backgroundColor: theme.white,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
    marginBottom: 15,
  },
});
