import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryColor,
    justifyContent: 'center',
  },
  imageWrap: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  buttonWrap: {
    paddingHorizontal: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  pillButtonWrap: {
    marginBottom: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.transparent,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
    margin: 8,
    width: theme.fullWidth - 80,
    height: 48,
  },
  buttonText: {
    ...theme.textBold14,
    color: theme.white,
    paddingTop: 2,
    letterSpacing: 1.5,
  },
  signInWrap: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  memberText: {
    ...theme.textBold14,
    color: theme.secondaryColor,
    paddingTop: 2,
    letterSpacing: 1.5,
    marginRight: 10,
    marginBottom: 20,
  },
  signInBtnText: {
    marginRight: 10,
    marginBottom: 20,
  },
});
