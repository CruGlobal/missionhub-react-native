import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  name: {
    flex: 0,
    flexWrap: 'wrap',
    borderWidth: 1,
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
