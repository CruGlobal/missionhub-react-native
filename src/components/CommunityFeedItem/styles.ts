import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  cardContent: {
    flex: 1,
  },

  postTextWrap: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
  },
  topLeft: {
    justifyContent: 'flex-start',
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
    backgroundColor: theme.grey,
    borderRadius: 20,
  },
  clearNotificationIcon: {
    padding: 8,
    color: theme.white,
  },
});
