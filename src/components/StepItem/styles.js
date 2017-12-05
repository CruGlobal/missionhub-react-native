
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  row: {
    height: 90,
    paddingHorizontal: 24,
    backgroundColor: theme.convert({ color: theme.white, alpha: 0.5 }),
    width: theme.fullWidth,
  },
  swipeable: {
    marginTop: 1,
  },
  draggable: {
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
  },
  dragging: {
    backgroundColor: theme.convert({ color: theme.white, alpha: 0.8 }),
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 7,
    elevation: 8,
  },
  person: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primaryColor,
  },
  description: {
    fontSize: 14,
  },
});
