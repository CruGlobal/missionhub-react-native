
import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    backgroundColor: theme.secondaryColor,
    width: theme.fullWidth,
  },
  text: {
    fontSize: 28,
    color: theme.white,
    width: 200,
  },
  topSection: {
    paddingTop: 30,
    paddingLeft: 50,
    paddingBottom: 10,
    backgroundColor: theme.secondaryColor,
  },
  bottomSection: {
    paddingLeft: 50,
    paddingBottom: 40,
    backgroundColor: theme.impactBlue,
  },
  topText: {
  },
});
