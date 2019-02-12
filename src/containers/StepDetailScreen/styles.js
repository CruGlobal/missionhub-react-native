import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
  },
  backButton: {
    color: theme.inactiveColor,
  },
  completedStepText: {
    fontSize: 14,
    lineHeight: 20,
  },
  removeStepButton: {
    paddingRight: 10,
  },
  removeStepButtonText: {
    color: theme.inactiveColor,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  stepTitleText: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '300',
  },
  tipTitleText: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '300',
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  tipDescriptionText: {
    fontSize: 16,
    lineHeight: 26,
    paddingHorizontal: 32,
    paddingTop: 14,
  },
  stepTitleContainer: {
    marginVertical: 26,
    marginHorizontal: 32,
  },
  tipContainer: {
    marginVertical: 26,
  },
  bottomButton: {
    width: theme.fullWidth,
  },
});
