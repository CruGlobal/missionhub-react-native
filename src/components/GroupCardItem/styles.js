import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.white,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoWrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 13,
  },
  groupName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.white,
  },
  groupNumber: {
    fontSize: 12,
    color: theme.white,
  },
});
