import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  list: {
    paddingTop: 15,
  },
  header: {
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: theme.primaryColor,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.white,
  },
  assignButton: {
    paddingVertical: 8,
    backgroundColor: theme.red,
    borderRadius: 25,
    minWidth: 200,
    alignSelf: 'center',
    marginVertical: 8,
  },
  assignButtonText: {
    fontSize: 14,
  },
  content: {
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
  },
  row: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 13,
    backgroundColor: theme.white,
    borderBottomColor: theme.separatorColor,
    borderBottomWidth: theme.separatorHeight,
    paddingBottom: 15,
  },
  rowContent: {
    paddingLeft: 15,
    borderLeftColor: theme.separatorColor,
    borderLeftWidth: 1,
  },
  icon: {
    textAlign: 'center',
    alignSelf: 'center',
    color: theme.primaryColor,
  },
  date: {
    marginBottom: 5,
    fontSize: 14,
    color: theme.grey1,
  },
  title: {
    fontSize: 16,
    color: theme.primaryColor,
  },
  comment: {
    marginTop: 25,
    marginBottom: 5,
    fontSize: 14,
  },
});
