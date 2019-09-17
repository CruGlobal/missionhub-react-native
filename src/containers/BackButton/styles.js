import { StyleSheet } from 'react-native';

import { isAndroid } from '../../utils/common';

export default StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  absoluteTopLeft: {
    position: 'absolute',
    top: isAndroid ? 7 : 25,
    left: 5,
  },
});
