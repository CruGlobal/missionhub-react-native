import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  sectionWrap: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: theme.extraLightGrey,
    backgroundColor: theme.extraLightGrey,
  },
  header: {
    height: 50,
    backgroundColor: theme.primaryColor,
  },
  list: {
    paddingVertical: 6,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    color: theme.white,
    paddingLeft: 20,
  },
  icon: {
    padding: 10,
  },
});
