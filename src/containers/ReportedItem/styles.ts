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
    color: theme.grey,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '300',
    paddingVertical: 20,
  },
  respondedMessage: {
    color: theme.grey,
    fontSize: 16,
    lineHeight: 24,
  },
  openPost: {
    color: theme.parakeetBlue,
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
