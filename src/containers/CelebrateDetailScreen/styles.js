import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { hasNotch } from '../../utils/common';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    flex: 1,
    justifyContent: 'center',
  },
  cardStyle: {
    shadowOpacity: 0,
    shadowRadius: 0,
    marginHorizontal: 3,
    marginTop: hasNotch() ? 50 : 25,
  },
  backButtonStyle: { color: theme.black },
});
