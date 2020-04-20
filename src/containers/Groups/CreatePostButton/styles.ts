import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    borderBottomColor: theme.extraLightGrey,
    borderBottomWidth: 1,
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    marginBottom: 5,
    marginTop: -5,
    paddingTop: 5,
  },
  inputButton: {
    backgroundColor: theme.extraLightGrey,
    borderRadius: 18,
    marginVertical: 16,
    height: 36,
    marginHorizontal: 20,
    paddingHorizontal: 6,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  profileWrapper: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: theme.communityProfileGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 12,
    color: theme.white,
  },
  inputText: {
    paddingHorizontal: 8,
    fontSize: 14,
    height: 18,
  },
});
