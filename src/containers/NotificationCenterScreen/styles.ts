import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: theme.primaryColor,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  sectionHeader: {
    backgroundColor: theme.extraLightGrey,
    fontSize: 24,
    fontWeight: '300',
  },
  sectionHeaderText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#505256',
    padding: 10,
    marginLeft: 10,
  },
  nullContainer: {
    borderRadius: 100,
    width: 150,
    height: 150,
    backgroundColor: theme.extraLightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nullTitle: {
    fontSize: 24,
    fontWeight: '300',
    paddingVertical: 30,
  },
  nullText: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 300,
    textAlign: 'center',
  },
});
