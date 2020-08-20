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
    ...theme.textLight24,
    textAlign: 'center',
  },
  textOnly: {
    marginHorizontal: 15,
  },
  title: {
    ...theme.textLight32,
    marginTop: 20,
    marginHorizontal: 20,
  },
  textWithTitle: {
    ...theme.textRegular14,
    marginHorizontal: 20,
    marginTop: 5,
  },
  closeButtonWrap: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 30,
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
    shadowColor: theme.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exampleTypes: {
    backgroundColor: theme.secondaryColor,
    paddingTop: 20,
    paddingHorizontal: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  exampleTypesTextWrap: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.white,
    borderRadius: 30,
    paddingVertical: 5,
    width: 50,
  },
  exampleTypesText: {
    ...theme.textRegular12,
    color: theme.accentColor,
    marginRight: 3,
    fontWeight: 'bold',
  },

  gotItButton: {
    width: theme.fullWidth - 100,
    height: 48,
    marginVertical: 15,
    marginHorizontal: 30,
  },
  gotItText: {
    ...theme.textBold14,
    color: theme.white,
  },
});
