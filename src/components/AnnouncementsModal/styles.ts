import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  modalStyle: {
    flex: 1,
    backgroundColor: theme.fadedBlackBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    flex: 0.4,
    width: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 40,
  },
  modalButton: {
    width: theme.fullWidth - 150,
    height: 48,
    alignItems: 'center',
    backgroundColor: theme.primaryColor,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 1.5,
  },
  closeButton: {
    color: theme.lightGrey,
    position: 'absolute',
    padding: 25,
    top: -70,
    right: -20,
    margin: 0,
    justifyContent: 'flex-end',
  },
  titleText: {
    ...theme.textLight24,
    textAlign: 'center',
    color: '#333333',
  },
  bodyText: {
    ...theme.textRegular16,
    textAlign: 'center',
  },
});
