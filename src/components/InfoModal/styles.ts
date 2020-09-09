import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  modalStyle: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    padding: 14,
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
    margin: 0,
    justifyContent: 'flex-end',
  },
  titleText: {
    ...theme.textLight24,
    fontFamily: 'SourceSansPro-Light',
    textAlign: 'center',
    color: '#333333',
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: theme.textColor,
  },
});
