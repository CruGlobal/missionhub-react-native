import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: theme.white,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  section: {
    paddingVertical: 8,
  },
  editButtonText: {
    color: theme.secondaryColor,
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 1,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '100',
  },
  subHeader: {
    color: theme.inactiveColor,
    fontSize: 10,
  },
  dateText: {
    color: theme.primaryColor,
    fontSize: 14,
  },
  number: {
    color: theme.primaryColor,
    fontSize: 48,
    fontWeight: '100',
    lineHeight: 50,
  },
});
