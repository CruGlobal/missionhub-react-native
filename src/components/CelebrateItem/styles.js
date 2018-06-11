import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    paddingRight: 30,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.white,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
  },
  icon: {
    color: theme.grey1,
    fontSize: 30,
    margin: 0,
    marginLeft: 4,
  },
  likeActive: {
    color: theme.primaryColor,
  },
  name: {
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: theme.grey1,
    fontSize: 12,
  },
  description: {
    paddingTop: 12,
    fontSize: 14,
  },
  likeCount: {
    fontSize: 14,
    color: theme.primaryColor,
    fontWeight: 'bold',
  },
});
