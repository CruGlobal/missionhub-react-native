import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 5,
    alignItems: 'stretch',
    backgroundColor: theme.white,
    borderRadius: 8,
  },
  detailButton: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 16,
    marginBottom: 3,
  },
  statsSection: {
    paddingTop: 8,
  },
  joinButton: {
    backgroundColor: theme.secondaryColor,
    paddingVertical: 8,
    height: undefined, // Need this to override the normal button styles
  },
  completeButton: {
    backgroundColor: theme.green,
    paddingVertical: 8,
    height: undefined, // Need this to override the normal button styles
  },
  joinCompleteButtonText: {
    fontSize: 14,
  },
  checkIcon: {
    color: theme.green,
    fontSize: 20,
  },
});
