import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  controlWrap: {
    flex: 1,
  },
  deleteWrap: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  deleteButton: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: theme.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    margin: 16,
    paddingLeft: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00000066',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
