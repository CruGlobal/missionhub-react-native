import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.impactBlue,
  },
  image: {
    backgroundColor: theme.secondaryColor,
    width: theme.fullWidth,
    // Android was cutting off the top part of the clouds in the image.
    // Take the image scale and multiply it by the width to get the height
    height: (205 / 375) * theme.fullWidth,
  },
  text: {
    fontSize: 28,
    color: theme.white,
    width: 270,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: theme.secondaryColor,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: theme.impactBlue,
  },
});
