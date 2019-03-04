import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    height: 70,
    width: 70,
    margin: 8,
    borderRadius: 35,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonInactive: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.secondaryColor,
  },
  buttonActive: {
    backgroundColor: theme.secondaryColor,
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    fontWeight: 'normal',
  },
  buttonTextInactive: {
    color: theme.secondaryColor,
  },
  buttonTextActive: {
    color: theme.white,
  },
});
