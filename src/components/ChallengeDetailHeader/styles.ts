import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    marginBottom: 80,
  },
  section: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderBottomColor: theme.extraLightGrey,
    borderBottomWidth: 1,
  },
  detailSection: {
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  editButtonText: {
    color: theme.challengeBlue,
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 1,
  },
  title: {
    color: theme.grey,
    fontFamily: 'SourceSansPro-Light',
    fontSize: 24,
    lineHeight: 30,
  },
  subHeader: {
    color: theme.inactiveColor,
    fontSize: 12,
  },
  dateText: {
    color: theme.grey,
    fontSize: 16,
  },
  detailText: {
    fontSize: 16,
  },
});
