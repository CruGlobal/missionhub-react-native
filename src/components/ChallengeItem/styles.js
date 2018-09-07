import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 5,
    alignItems: 'stretch',
    backgroundColor: theme.white,
  },
  joinCard: {
    borderColor: theme.secondaryColor,
    borderWidth: 1,
  },
  content: {
    padding: 16,
  },
  completeIcon: {
    opacity: 1,
    margin: 0,
    height: 24,
    width: 24,
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
  joinButtonText: {
    fontSize: 14,
  },
});
