import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  absoluteTopLeft: {
    position: 'absolute',
    top: 25 + theme.notchHeight,
    left: 5,
  },
});
