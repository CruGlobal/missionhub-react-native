import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondaryColor,
  },
  image: {
    backgroundColor: theme.secondaryColor,
    width: theme.fullWidth,
    // Android was cutting off the top part of the clouds in the image.
    // Take the image scale and multiple it by the width to get the height
    height: 205 / 375 * theme.fullWidth,
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
  interactionsWrap: {
    paddingHorizontal: 40,
  },
  interactionSection: {
    paddingBottom: 40,
    backgroundColor: theme.impactBlue,
  },
  topText: {},
  icon: {
    fontSize: 28,
  },
  interactionText: {
    fontSize: 16,
    color: theme.white,
  },
  interactionNumber: {
    fontSize: 24,
    color: theme.white,
  },
  interactionRow: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  periodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: theme.accentColor,
    borderWidth: 1,
    backgroundColor: theme.transparent,
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: theme.white,
    fontSize: 18,
    fontWeight: '100',
  },
  activeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.accentColor,
    borderColor: theme.accentColor,
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
});
