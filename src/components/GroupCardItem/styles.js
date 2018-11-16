import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
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
  joinButton: {
    backgroundColor: theme.red,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
    margin: 5,
  },
  joinButtonText: {
    fontSize: 14,
    color: theme.white,
  },
});
