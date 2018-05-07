
import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  wrap: {
    backgroundColor: theme.primaryColor,
  },
  stageBtn: {
    backgroundColor: theme.accentColor,
    margin: 10,
    marginBottom: 5,
    height: 36,
  },
  noStage: {
    backgroundColor: '#FF5532',
    margin: 10,
    marginBottom: 5,
    height: 36,
  },
  stageBtnText: {
    color: theme.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    color: theme.white,
    fontSize: 24,
  },
  contactButton: {
    fontSize: 24,
    color: theme.secondaryColor,
  },
  contactButtonDisabled: {
    fontSize: 24,
    color: theme.secondaryColor,
    opacity: 0.5,
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
});
