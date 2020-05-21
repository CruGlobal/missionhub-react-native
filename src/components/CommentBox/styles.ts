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
  activeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 13,
    borderBottomColor: theme.grey1,
    borderBottomWidth: 1,
    position: 'relative',
  },
  activeActionIcon: {
    flex: 1,
    alignItems: 'center',
  },
  activeIcon: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.primaryColor,
  },
  activeTextWrap: {
    flex: 4,
    justifyContent: 'center',
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
    paddingLeft: 20,
    paddingBottom: 5,
  },
  activeDate: {
    marginBottom: 5,
    fontSize: 13,
    color: theme.grey1,
  },
  activeText: {
    color: theme.primaryColor,
    fontSize: 15,
  },
  clearAction: {
    position: 'absolute',
    top: 8,
    right: 8,
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
