import { StyleSheet } from 'react-native';
import theme from '../../theme';

let style = StyleSheet.create({
  dateTouch: {
    // width: 142,
  },
  dateTouchBody: {
    // flexDirection: 'row',
    // height: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  dateIcon: {
    width: 32,
    height: 32,
    marginLeft: 5,
    marginRight: 5,
  },
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
    backgroundColor: '#00000077',
  },
  datePickerCon: {
    backgroundColor: '#fff',
    height: 0,
    overflow: 'hidden',
  },
  btnText: {
    position: 'absolute',
    top: 0,
    height: 42,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextText: {
    fontSize: 16,
    color: '#46cf98',
  },
  btnTextCancel: {
    color: '#666',
  },
  btnCancel: {
    left: 0,
  },
  btnConfirm: {
    right: 0,
  },
  datePicker: {
    marginTop: 42,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  disabled: {
    backgroundColor: '#eee',
  },
});

export default style;
