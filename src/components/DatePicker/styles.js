import { StyleSheet } from 'react-native';

import theme from '../../theme';

const topHeight = 60;

export default StyleSheet.create({
  dateInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  dateText: {
    backgroundColor: theme.transparent,
    paddingVertical: 5,
    color: theme.white,
    fontSize: 16,
    letterSpacing: 0.25,
  },
  placeholderText: {
    color: theme.white,
  },
  datePickerMask: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerBox: {
    backgroundColor: theme.white,
    height: 0,
    overflow: 'hidden',
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
    color: theme.darkText,
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  btnText: {
    fontSize: 16,
    color: theme.iosBlue,
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
  disabled: {
    backgroundColor: '#eee',
  },
});
