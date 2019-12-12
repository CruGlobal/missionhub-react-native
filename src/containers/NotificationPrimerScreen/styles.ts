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
    paddingTop: 15,
    color: theme.white,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
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
    fontSize: 24,
    color: theme.white,
    textAlign: 'center',
    fontWeight: '300',
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
    color: theme.white,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 1.5,
  },
});
