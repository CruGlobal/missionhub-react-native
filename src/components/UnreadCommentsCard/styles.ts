import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  flex1: { flex: 1 },
  card: {
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 8,
    backgroundColor: theme.darkGrey,
  },
  content: {
    borderBottomColor: theme.white,
    borderBottomWidth: 1,
    padding: 12,
    overflow: 'hidden',
  },
  number: {
    ...theme.textRegular16,
    fontSize: 48,
    lineHeight: 48,
    color: theme.white,
  },
  description: {
    ...theme.textRegular14,
    color: theme.white,
  },
  viewWrap: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    ...theme.textBold14,
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
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
