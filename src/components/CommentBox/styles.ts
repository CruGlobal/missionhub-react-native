import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    width: theme.fullWidth,
    backgroundColor: theme.white,
    borderTopColor: theme.grey1,
    borderTopWidth: theme.separatorHeight,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'column',
  },
  actionSelectionWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primaryColor,
    borderRadius: 25,
    marginRight: 15,
  },
  actionsOpen: {
    backgroundColor: theme.grey1,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 5,
    marginHorizontal: 10,
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
  actions: {
    justifyContent: 'space-around',
    minHeight: 30,
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
