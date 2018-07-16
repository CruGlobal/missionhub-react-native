import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  contactButton: {
    fontSize: 24,
    color: theme.secondaryColor,
  },
  emailButton: {
    fontSize: 20,
  },
  iconWrap: {
    backgroundColor: theme.accentColor,
    width: 48,
    height: 48,
    borderRadius: 25,
    margin: 10,
  },
  text: {
    color: theme.white,
    fontSize: 11,
  },
});
