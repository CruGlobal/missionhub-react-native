import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    flexDirection: 'column',
  },
  fieldWrap: {
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingTop: 10,
  },
  textInput: {
    ...theme.textRegular16,
    fontSize: 24,
    lineHeight: 30,
    color: theme.lightGrey,
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
    ...theme.textRegular12,
    color: '#939393',
  },
  dateInput: {
    ...theme.textRegular16,
    color: theme.secondaryColor,
  },
  detailWrap: {
    borderColor: theme.extraLightGrey,
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  detailLabel: {
    ...theme.textRegular12,
    color: '#939393',
  },
  detailInput: {
    ...theme.textRegular16,
    color: theme.lightGrey,
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
