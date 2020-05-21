import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    width: theme.fullWidth,
    backgroundColor: theme.white,
    borderTopColor: theme.grey1,
    borderTopWidth: theme.separatorHeight,
    flexDirection: 'column',
  },
  boxWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  inputBoxWrap: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.white,
    borderRadius: 20,
    borderColor: theme.grey1,
    borderWidth: 1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingLeft: 13,
  },
  input: {
    borderBottomWidth: 0,
    paddingLeft: 5,
    paddingVertical: 7,
    flex: 1,
    fontSize: 16,
    color: theme.grey2,
  },
  submitIcon: {
    color: theme.primaryColor,
  },
  clearActionButton: {
    backgroundColor: theme.grey1,
    borderRadius: 25,
    padding: 8,
  },
  cancelWrap: {
    backgroundColor: theme.grey,
    borderRadius: 25,
    marginRight: 10,
  },
  cancelIcon: {
    color: theme.white,
  },
});
