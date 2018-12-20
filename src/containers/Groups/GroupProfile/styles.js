import { StyleSheet } from 'react-native';

import theme from '../../../theme';
import { hasNotch } from '../../../utils/common';

export default StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.grey,
    position: 'relative',
  },
  topNav: {
    position: 'absolute',
    paddingTop: 25,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 15,
    top: hasNotch() ? 17 : 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  imageWrap: {
    position: 'relative',
    borderRadius: 4,
    width: theme.fullWidth,
    minHeight: theme.fullHeight * 0.3,
    backgroundColor: theme.accentColor,
  },
  image: {
    borderRadius: 4,
    width: '100%',
    height: theme.fullHeight * 0.3,
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
    fontSize: 32,
    color: theme.white,
    letterSpacing: 0.25,
  },
  label: {
    fontSize: 12,
    color: theme.inactiveColor,
  },
  info: {
    width: '75%',
    color: theme.inactiveColor,
  },
  text: {
    fontSize: 12,
    color: theme.white,
  },
  codeText: {
    fontSize: 32,
    color: theme.white,
  },
  linkText: {
    fontSize: 14,
    color: theme.white,
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 32,
    color: theme.white,
    textAlign: 'left',
    borderBottomWidth: 0,
    letterSpacing: 0.25,
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
    backgroundColor: theme.red,
  },
  btnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.white,
  },
  createButton: {
    width: theme.fullWidth,
  },
});
