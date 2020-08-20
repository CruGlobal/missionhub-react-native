import { StyleSheet } from 'react-native';

import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  background: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  notSignedInContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  notSignedInButton: {
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    height: 42,
    marginLeft: 10,
  },
  closeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 9,
  },
  personInfoContainer: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  personName: theme.textRegular16,
  personEmail: theme.textRegular12,
  sectionTitle: {
    ...theme.textLight24,
    color: theme.lightGrey,
  },
  sectionContainer: {
    flexDirection: 'column',
    margin: 0,
    paddingHorizontal: 24,
    paddingVertical: 9,
    alignItems: 'flex-start',
  },
  button: { paddingHorizontal: 0, paddingVertical: 0, height: 50 },
  buttonText: {
    ...theme.textRegular16,
    letterSpacing: 0.2,
  },
  signOutText: {
    ...theme.textRegular16,
    color: theme.orange,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    ...theme.textRegular16,
    margin: 0,
    paddingHorizontal: 24,
    paddingVertical: 9,
    color: theme.lightGrey,
  },
  updateButton: {
    color: theme.white,
    backgroundColor: theme.secondaryColor,
    height: 30,
  },
  updateText: {
    ...theme.textRegular16,
    color: theme.white,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
