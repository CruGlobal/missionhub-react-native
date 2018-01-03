
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  row: {
    height: theme.itemHeight,
    paddingHorizontal: 24,
    backgroundColor: theme.convert({ color: theme.white, alpha: 0 }),
    width: theme.fullWidth,
  },
  swipeable: {
    marginTop: 1,
    backgroundColor: theme.convert({ color: theme.secondaryColor, lighten: 0.4 }),
  },
  listSwipeable: {
    marginTop: 1,
    backgroundColor: theme.white,
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
    height: 70,
  },
  draggable: {
    borderBottomWidth: theme.separatorHeight,
    borderBottomColor: theme.separatorColor,
    paddingVertical: 15,
  },
  dragging: {
    zIndex: 10,
    paddingVertical: 15,
    // backgroundColor: theme.convert({ color: theme.white, alpha: 0.8 }),
    backgroundColor: theme.convert({ color: theme.black, alpha: 0.6 }),
    // backgroundColor: 'orange',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 7,
  },
  offscreen: {
    opacity: 0,
    overflow: 'hidden',
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
