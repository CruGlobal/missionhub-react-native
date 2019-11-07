import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.white,
  },
  container: {
    flex: 1,
    backgroundColor: theme.grey,
  },
  header: {
    backgroundColor: 'white',
    padding: 14,
    paddingBottom: 5,
  },
  itemContent: {
    backgroundColor: 'white',
    padding: 14,
    marginTop: 0,
  },
  backButtonStyle: { marginLeft: 10 },
  backButtonIconStyle: { color: theme.black },
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
});
