import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  cardContent: {
    flex: 1,
  },
  clearNotificationWrap: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  clearNotificationTouchable: {
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: theme.darkGrey,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
