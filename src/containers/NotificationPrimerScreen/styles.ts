import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  text: {
    ...theme.textRegular16,
    paddingTop: 15,
    color: theme.white,
    textAlign: 'center',
  },
  allowButton: {
    backgroundColor: theme.secondaryColor,
    width: theme.fullWidth - 70,
    margin: 8,
    height: 48,
  },
  notNowButton: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    width: theme.fullWidth - 70,
    margin: 8,
    height: 48,
  },
  stepsNotificationContainer: {
    marginBottom: 88,
  },
  stepsNotificationText: {
    ...theme.textRegular16,
    fontSize: 24,
    color: theme.white,
    textAlign: 'center',
    lineHeight: 30,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    paddingTop: 20,
    marginBottom: -50,
  },
  stepsNotifcationImage: {
    position: 'absolute',
    top: '50%',
  },
  buttonText: {
    ...theme.textBold14,
    color: theme.white,
    letterSpacing: 1.5,
  },
});
