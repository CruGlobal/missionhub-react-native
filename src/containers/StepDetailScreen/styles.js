import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.white,
  },
  header: {
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
  },
  tipDescriptionText: {
    fontSize: 16,
    lineHeight: 26,
  },
  stepTitleContainer: {
    marginVertical: 26,
    marginHorizontal: 32,
  },
  tipTitleContainer: {
    marginVertical: 26,
    marginHorizontal: 32,
  },
  tipDescriptionContainer: {
    marginVertical: 4,
    marginHorizontal: 32,
  },
  bottomButton: {
    width: theme.fullWidth,
  },
});
