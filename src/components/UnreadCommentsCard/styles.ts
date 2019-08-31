import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  flex1: { flex: 1 },
  card: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 8,
    backgroundColor: theme.grey,
  },
  content: {
    borderBottomColor: theme.white,
    borderBottomWidth: 1,
    padding: 12,
    overflow: 'hidden',
  },
  number: {
    fontSize: 48,
    color: theme.white,
  },
  description: {
    fontSize: 14,
    color: theme.white,
  },
  viewWrap: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.white,
  },
  closeWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  background: {
    width: 48,
    height: 48,
    opacity: 0.35,
    position: 'absolute',
    top: 32,
    right: -15,
  },
});
