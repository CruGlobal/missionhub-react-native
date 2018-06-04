import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    paddingVertical: 5,
    width: theme.fullWidth,
    backgroundColor: theme.white,
    borderTopColor: theme.grey2,
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
    marginBottom: 50,
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
  actionText: {
    fontSize: 12,
    color: theme.grey2,
    textAlign: 'center',
  },
  boxWrap: {
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  inputWrap: {
    paddingRight: 5,
    paddingLeft: 13,
    backgroundColor: theme.white,
    borderRadius: 25,
    borderColor: theme.grey2,
    borderWidth: 1,
  },
  input: {
    borderBottomWidth: 0,
    paddingVertical: 5,
    flex: 1,
    fontSize: 16,
    color: theme.grey2,
  },
  actions: {
    justifyContent: 'space-around',
    minHeight: 50,
  },
});
