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
    borderColor: theme.parakeetBlue,
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
    paddingVertical: 16,
  },
  personInfoContainer: {
    flexDirection: 'column',
    paddingLeft: 10,
  },
  personName: {
    fontSize: 16,
    color: theme.textColor,
    lineHeight: 24,
  },
  personEmail: {
    fontSize: 12,
    color: theme.textColor,
    lineHeight: 16,
  },
  sectionTitle: {
    fontFamily: 'SourceSansPro-Light',
    color: COLORS.NARWHAL_GREY,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
  },
  sectionContainer: {
    flexDirection: 'column',
    margin: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  button: { paddingHorizontal: 0, paddingVertical: 0, height: 50 },
  buttonText: {
    fontWeight: 'normal',
    color: theme.textColor,
    letterSpacing: 0.2,
    fontSize: 16,
  },
  buttonTextSelected: {
    color: COLORS.LIGHT_BLUE,
  },
  signOutText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.honeyCrispOrgange,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    margin: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.NARWHAL_GREY,
  },
  updateButton: {
    color: theme.white,
    backgroundColor: theme.parakeetBlue,
    height: 30,
  },
  updateText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.2,
    textAlign: 'center',
    height: 25,
  },
});
