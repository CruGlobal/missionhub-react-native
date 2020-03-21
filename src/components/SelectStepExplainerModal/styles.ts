import { StyleSheet } from 'react-native';

import theme from '../../theme';

export const sliderWidth = theme.fullWidth - 40;
export const sliderHeight = Math.min(theme.fullHeight * 0.75, 460);
const MIDDLE_ICON_SIZE = 48;

export default StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    height: theme.fullHeight,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'relative',
    backgroundColor: theme.white,
    borderRadius: 24,
    overflow: 'hidden',
    width: sliderWidth,
    height: sliderHeight,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  textWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
  },
  text: {
    color: theme.grey,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '300',
    textAlign: 'center',
  },
  textOnly: {
    marginHorizontal: 15,
  },
  title: {
    marginTop: 20,
    fontSize: 32,
    lineHeight: 38,
    marginHorizontal: 20,
  },
  textWithTitle: {
    marginHorizontal: 20,
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButtonWrap: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  closeButton: {
    color: theme.white,
  },
  middleIconWrap: {
    position: 'relative',
    height: 0,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleIconCircle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -MIDDLE_ICON_SIZE,
    width: MIDDLE_ICON_SIZE * 2,
    height: MIDDLE_ICON_SIZE * 2,
    borderRadius: MIDDLE_ICON_SIZE,
    backgroundColor: theme.white,
    shadowColor: theme.grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
