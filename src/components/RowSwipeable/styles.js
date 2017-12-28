
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  optionsWrap: {
    position: 'absolute',
    right: 0,
    marginTop: 1,
    top: 0,
    bottom: 0,
  },
  deleteWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.red,
  },
  completeWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.checkBackgroundColor,
  },
  editWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.inactiveColor,
  },
});
