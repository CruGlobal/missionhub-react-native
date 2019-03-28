import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  itemWrap: {
    padding: 20,
    borderBottomColor: theme.grey,
    borderBottomWidth: theme.separatorHeight,
  },
  item: {
    marginHorizontal: 0,
    marginVertical: 0,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: theme.red,
  },
  itemIcon: {
    color: theme.white,
  },
  itemText: {
    marginLeft: 15,
    color: theme.white,
  },
  bothPadding: {
    padding: 4,
  },
  commentCard: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 8,
    backgroundColor: theme.grey,
  },
  commentCardContent: {
    borderBottomColor: theme.white,
    borderBottomWidth: 1,
    padding: 12,
    overflow: 'hidden',
  },
  commentCardNumber: {
    fontSize: 48,
    color: theme.white,
  },
  commentCardDescription: {
    fontSize: 14,
    color: theme.white,
  },
  commentCardViewWrap: {
    padding: 12,
  },
  commentCardViewText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.white,
  },
  commentCardCloseWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  commentCardBackground: {
    width: 48,
    height: 48,
    opacity: 0.35,
    position: 'absolute',
    top: 32,
    right: -15,
  },
});
