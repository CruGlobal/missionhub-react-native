import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  detailButton: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    ...theme.textRegular16,
    color: theme.accentColor,
    marginBottom: 3,
  },
  statsSection: {
    paddingTop: 8,
  },
  joinCompleteButton: {
    backgroundColor: theme.secondaryColor,
    paddingVertical: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  joinCompleteButtonText: {
    ...theme.textBold14,
    color: theme.white,
  },
});
