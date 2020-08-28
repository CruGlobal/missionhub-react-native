import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  modalStyle: {
    flex: 1,
    backgroundColor: theme.fadedBlackBackgroundColor,
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
  closeButton: {
    color: theme.lightGrey,
    position: 'absolute',
    padding: 15,
    top: -50,
    right: -20,
    justifyContent: 'flex-end',
  },
  titleText: {
    ...theme.textRegular14,
    paddingBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    ...theme.textRegular16,
    color: theme.lightGrey,
    paddingHorizontal: 10,
  },
});
