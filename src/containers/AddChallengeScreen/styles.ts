import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    flexDirection: 'column',
  },
  textInput: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
    color: theme.grey,
    borderBottomWidth: 0,
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  dateWrap: {
    borderColor: theme.extraLightGrey,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  dateLabel: {
    fontSize: 12,
    color: '#939393',
  },
  dateInput: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.challengeBlue,
  },
  detailWrap: {
    borderColor: theme.extraLightGrey,
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  detailLabel: {
    fontSize: 12,
    color: '#939393',
  },
  detailInput: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.grey,
    borderBottomWidth: 0,
    marginBottom: 26,
    paddingBottom: 70,
  },
  challengeImage: {
    position: 'absolute',
    zIndex: -1,
    bottom: 0,
    right: 0,
  },
  backButton: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  disabledButton: {
    backgroundColor: theme.lightGrey,
  },
});
