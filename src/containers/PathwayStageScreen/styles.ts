import { StyleSheet } from 'react-native';

import theme from '../../theme';

export const screenMargin = 60;
export const sliderWidth = theme.fullWidth;
export const stageWidth = theme.fullWidth - screenMargin * 2;
export const stageMargin = theme.fullWidth / 30;
export const overScrollMargin = 150;
export const getLandscapeWidth = (stages: number) =>
  stageWidth * stages +
  stageMargin * (stages - 1) +
  screenMargin * 2 +
  overScrollMargin * 2;

const landscapeHeight = 275;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundColor,
  },
  title: {
    color: theme.primaryColor,
    fontWeight: '500',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
    paddingBottom: 25,
    paddingTop: 45,
    paddingHorizontal: 30,
    width: theme.fullWidth - 100,
    textAlign: 'center',
  },
  cardText: {
    color: theme.textColor,
    textAlign: 'center',
    padding: 5,
    fontSize: 16,
  },
  cardHeader: {
    fontSize: 42,
    color: theme.primaryColor,
    textAlign: 'center',
    padding: 5,
  },
  cardWrapper: {
    justifyContent: 'space-between',
    backgroundColor: theme.white,
    height: 320,
    width: stageWidth,
    marginHorizontal: stageMargin,
  },
  card: {
    alignItems: 'center',
    paddingTop: 30,
    paddingRight: 15,
    paddingLeft: 15,
  },
  footerImage: {
    position: 'absolute',
    bottom: -100,
    // height: 0.4 * theme.fullWidth,
    height: landscapeHeight,
  },
});
