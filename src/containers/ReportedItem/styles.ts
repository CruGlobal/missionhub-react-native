import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 8,
    backgroundColor: theme.white,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  reportedInfoContainer: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.extraLightGrey,
  },
  respondedContentContainer: {
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  respondedTitle: {
    ...theme.textLight24,
    color: theme.lightGrey,
    paddingVertical: 20,
  },
  respondedMessage: {
    ...theme.textRegular16,
    color: theme.lightGrey,
  },
  openPost: {
    color: theme.secondaryColor,
  },
  users: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.extraLightGrey,
  },
  comment: {
    paddingTop: 15,
  },
  buttonLeft: {
    height: 50,
    borderRightWidth: 1,
    borderRightColor: theme.white,
    borderBottomLeftRadius: 8,
  },
  buttonRight: {
    height: 50,
    borderBottomRightRadius: 8,
  },
});
