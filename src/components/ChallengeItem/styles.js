import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
    alignItems: 'stretch',
    backgroundColor: theme.white,
  },
  unjoinedCard: {
    borderColor: theme.secondaryColor,
    borderWidth: 1,
  },
  joinedCard: {
    borderColor: theme.green,
    borderWidth: 1,
  },
  detailButton: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  editButtonText: {
    color: theme.secondaryColor,
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 1,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 14,
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
