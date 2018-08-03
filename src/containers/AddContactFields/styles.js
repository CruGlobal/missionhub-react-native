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
  permissionsRow: {
    paddingVertical: 15,
  },
  genderRadioButton: {
    paddingHorizontal: 15,
  },
  contactRadioButton: {
    paddingRight: 15,
  },
  userRadioButton: {
    paddingHorizontal: 15,
  },
  adminRadioButton: {
    paddingLeft: 15,
  },
});
