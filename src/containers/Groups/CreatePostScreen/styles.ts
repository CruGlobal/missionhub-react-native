import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    flexDirection: 'column',
  },
  headerText: theme.textRegular14,
  createPostButtonText: {
    ...theme.textRegular16,
    color: theme.secondaryColor,
  },
  icon: { height: 24, width: 24 },
  postLabelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 35,
    marginTop: 26,
  },
  lineBreak: {
    height: 1,
    width: theme.fullWidth,
    backgroundColor: theme.extraLightGrey,
  },
  addPhotoButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 35,
    paddingVertical: 20,
  },
  addPhotoText: {
    ...theme.textRegular16,
    paddingHorizontal: 10,
  },
  image: {
    width: theme.fullWidth,
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  textInput: {
    ...theme.textLight24,
    color: theme.darkGrey,
    borderBottomWidth: 0,
    paddingHorizontal: 35,
    paddingTop: 20,
    paddingBottom: 28,
  },
});
