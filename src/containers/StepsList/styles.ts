import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  list: {
    paddingBottom: 16,
    backgroundColor: theme.transparent,
  },
  card: {
    marginTop: 16,
    marginBottom: 4,
    marginHorizontal: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  createStepIcon: {
    fontSize: 25,
    color: theme.backgroundColor,
  },
  createStepText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: theme.backgroundColor,
  },
});
