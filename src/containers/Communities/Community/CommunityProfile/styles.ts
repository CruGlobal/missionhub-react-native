import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.primaryColor,
  },
  content: { flex: 1, backgroundColor: theme.darkGrey },
  flex: {
    flex: 1,
  },
  imageWrap: {
    position: 'relative',
    borderRadius: 4,
    width: theme.fullWidth,
    height: theme.fullWidth * theme.communityImageAspectRatio,
    backgroundColor: theme.accentColor,
  },
  image: {
    borderRadius: 4,
    width: '100%',
    height: '100%',
  },
  absoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  rowWrap: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  separator: {
    marginVertical: 5,
  },
  name: {
    ...theme.textLight32,
    color: theme.white,
  },
  label: {
    ...theme.textRegular12,
    color: theme.extraLightGrey,
  },
  info: {
    ...theme.textRegular12,
    width: '75%',
    color: theme.extraLightGrey,
  },
  text: {
    ...theme.textRegular12,
    color: theme.white,
  },
  codeText: {
    ...theme.textLight32,
    color: theme.white,
  },
  linkText: {
    ...theme.textRegular14,
    color: theme.white,
    marginRight: 5,
  },
  input: {
    ...theme.textLight32,
    flex: 1,
    color: theme.white,
    textAlign: 'left',
    borderBottomWidth: 0,
    paddingVertical: 0,
  },
  menu: {
    marginLeft: 15,
    color: theme.white,
  },
  btn: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: theme.secondaryColor,
  },
  newBtn: {
    backgroundColor: theme.orange,
  },
  btnText: {
    ...theme.textBold14,
    color: theme.white,
  },
  createButton: {
    width: theme.fullWidth,
  },
  editBtn: {
    paddingRight: 15,
  },
  closeButton: {
    paddingLeft: 10,
  },
});
