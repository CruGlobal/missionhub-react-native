
import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: theme.primaryColor,
  },
  stageBtn: {
    backgroundColor: theme.accentColor,
    margin: 10,
    height: 36,
  },
  stageBtnText: {
    color: theme.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    color: theme.white,
    fontSize: 24,
  },
});
