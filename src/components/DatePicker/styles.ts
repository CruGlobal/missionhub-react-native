import { StyleSheet } from 'react-native';

import theme from '../../theme';

const topHeight = 60;

export default StyleSheet.create({
  datePickerMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerBox: {
    backgroundColor: theme.fadedBlackBackgroundColor,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  topWrap: {
    position: 'absolute',
    top: 0,
    height: topHeight,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
  },
  titleText: {
    ...theme.textRegular16,
    flex: 1,
    textAlign: 'center',
  },
  btnText: {
    ...theme.textRegular16,
    color: '#007AFF',
  },
  btnTextCancel: {
    textAlign: 'left',
  },
  btnTextConfirm: {
    textAlign: 'right',
  },
  datePicker: {
    marginTop: topHeight,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
});
