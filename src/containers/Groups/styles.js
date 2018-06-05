import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: theme.white,
  },
  cardList: {
    flex: 1,
    paddingVertical: 8,
  },
  cardSectionHeader: {
    paddingVertical: 8,
  },
  cardSectionText: {
    fontSize: 14,
    alignContent: 'center',
  },
});
