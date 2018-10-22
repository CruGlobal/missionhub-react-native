import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
    alignItems: 'stretch',
    backgroundColor: theme.white,
  },
  content: {
    padding: 16,
  },
  editButtonText: {
    color: theme.secondaryColor,
    fontSize: 11,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 16,
    marginBottom: 3,
  },
  info: {
    fontSize: 11,
    color: theme.grey1,
  },
  dot: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.grey1,
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
