import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  modalStyle: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerStyle: {
    width: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderRadius: 14,
    padding: 14,
    paddingVertical: 50,
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
    top: -40,
    right: -5,
    margin: 0,
    justifyContent: 'flex-end',
  },
  titleText: {
    marginTop: -40,
    paddingBottom: 20,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: theme.grey,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SourceSansPro-Regular',
    lineHeight: 24,
    color: theme.lightGrey,
    paddingHorizontal: 10,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: theme.textColor,
  },
});
