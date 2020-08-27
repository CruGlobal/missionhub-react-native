import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  fieldsWrap: {
    paddingVertical: 50,
    paddingHorizontal: 25,
  },
  textWrap: { alignItems: 'center', marginBottom: 30 },
  addPersonText: {
    ...theme.textRegular16,
    maxWidth: 230,
    color: theme.white,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
  },
  label: {
    ...theme.textRegular12,
    marginTop: 15,
    color: theme.secondaryColor,
  },
  editLabel: {
    ...theme.textRegular12,
    marginTop: 15,
    color: theme.lightGrey,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    borderColor: theme.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageButton: {
    borderColor: theme.lightGrey,
    borderWidth: 1,
    color: theme.secondaryColor,
    alignItems: 'flex-start',
  },

  categoryText: {
    ...theme.textRegular16,
    color: theme.secondaryColor,
    alignItems: 'flex-start',
    marginVertical: 10,
    width: '100%',
  },
  changeAvatarButton: {
    width: 32,
    height: 32,
    borderRadius: 50,
    position: 'absolute',
    top: 60,
    left: 65,
    backgroundColor: theme.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
