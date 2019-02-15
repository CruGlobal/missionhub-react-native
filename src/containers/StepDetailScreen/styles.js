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
    marginVertical: 26,
    marginHorizontal: 32,
  },
  tipContainer: {
    marginVertical: 26,
    paddingHorizontal: 32,
    paddingBottom: 14,
  },
  bottomButton: {
    width: theme.fullWidth,
  },
});

export const markdownStyles = {
  heading1: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '300',
  },
  text: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    lineHeight: 26,
  },
  strong: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 26,
  },
  listItemBullet: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    lineHeight: 26,
    paddingRight: 16,
    alignSelf: 'flex-start',
  },
};
