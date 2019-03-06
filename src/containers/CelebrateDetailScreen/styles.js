import { StyleSheet } from 'react-native';

import theme from '../../theme';

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
  },
  backButtonStyle: { color: theme.black },
  headerStyle: { backgroundColor: theme.white },
  rightHeaderItemStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
