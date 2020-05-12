import { StyleSheet } from 'react-native';

import theme from '../../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 14,
    lineHeight: 20,
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
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  image: {
    width: theme.fullWidth,
  },
  backButton: {
    fontSize: 16,
    color: theme.lightGrey,
  },
  textInput: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
    color: theme.lightGrey,
    borderBottomWidth: 0,
    paddingHorizontal: 35,
    paddingTop: 20,
    paddingBottom: 28,
  },
});