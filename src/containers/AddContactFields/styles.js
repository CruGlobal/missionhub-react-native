import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  fieldsWrap: {
    paddingVertical: 50,
    paddingHorizontal: 25,
  },
  label: {
    fontSize: 13,
    marginTop: 15,
    color: theme.secondaryColor,
  },
  genderRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.secondaryColor,
  },
  genderText: {
    color: theme.white,
    fontSize: 16,
  },
  radioButton: {
    paddingHorizontal: 15,
  },
});
