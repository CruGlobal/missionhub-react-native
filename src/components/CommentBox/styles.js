import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    paddingVertical: 5,
    width: theme.fullWidth,
    backgroundColor: theme.white,
    borderTopColor: theme.grey1,
    borderTopWidth: theme.separatorHeight,
  },
  actionSelectionWrap: {
    backgroundColor: theme.primaryColor,
    borderRadius: 25,
    marginRight: 15,
  },
  actionsOpen: {
    backgroundColor: theme.grey2,
  },
  actionSelectionIcon: {
    backgroundColor: theme.transparent,
    alignItems: 'center',
  },
  actionRowWrap: {
    padding: 0,
    marginBottom: 15,
    alignItems: 'center',
    flex: 1,
  },
  actionIconButton: {
    backgroundColor: theme.grey2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 45,
    borderRadius: 25,
  },
  actionIconActive: {
    backgroundColor: theme.grey1,
  },
  actionText: {
    fontSize: 12,
    color: theme.grey2,
    textAlign: 'center',
  },
  boxWrap: {
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  inputBoxWrap: {
    backgroundColor: theme.white,
    borderRadius: 20,
    borderColor: theme.grey1,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  inputWrap: {
    paddingRight: 5,
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
  actions: {
    justifyContent: 'space-around',
    minHeight: 30,
  },
  activeAction: {
    paddingVertical: 13,
    borderBottomColor: theme.grey2,
    borderBottomWidth: 1,
    position: 'relative',
  },
  activeIcon: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.primaryColor,
  },
  activeTextWrap: {
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
});
