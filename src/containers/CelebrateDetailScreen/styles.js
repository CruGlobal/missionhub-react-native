import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    flex: 1,
    justifyContent: 'center',
  },
  cardStyle: {
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    marginHorizontal: 3,
  },
  backButtonStyle: { color: theme.black },
  headerStyle: { backgroundColor: theme.white },
  leftHeaderItemStyle: { marginLeft: 25 },
  rightHeaderItemStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  trailsTop: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  trailsBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  scrollContent: {
    minHeight: theme.fullHeight * 0.8,
  },
});
