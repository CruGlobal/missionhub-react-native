import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  fieldsWrap: {
    paddingVertical: 50,
    paddingHorizontal: 25,
  },
  textWrap: { alignItems: 'center', marginBottom: 30 },
  addPersonText: {
    fontFamily: 'SourceSansPro-Light',
    maxWidth: 230,
    color: theme.white,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    marginTop: 15,
    color: theme.secondaryColor,
  },
  editLabel: {
    fontSize: 13,
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
    color: theme.parakeetBlue,
    alignItems: 'flex-start',
  },

  categoryText: {
    color: theme.parakeetBlue,
    fontSize: 16,
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  changeAvatarButton: {
    width: 32,
    height: 32,
    borderRadius: 50,
    position: 'absolute',
    top: 60,
    left: 65,
    backgroundColor: theme.parakeetBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
