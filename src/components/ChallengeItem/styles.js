import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'stretch',
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
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  completeButton: {
    backgroundColor: theme.green,
    paddingVertical: 8,
    height: undefined, // Need this to override the normal button styles
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  joinCompleteButtonText: {
    fontSize: 14,
  },
  checkIcon: {
    color: theme.green,
    fontSize: 20,
  },
});
