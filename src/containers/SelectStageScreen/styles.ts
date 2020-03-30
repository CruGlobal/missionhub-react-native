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
  backgroundWrapper: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: theme.primaryColor,
    fontWeight: '500',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 24,
    paddingVertical: 24,
    paddingHorizontal: 30,
    width: theme.fullWidth - 100,
    textAlign: 'center',
  },
  cardText: {
    color: theme.textColor,
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
  },
  cardHeader: {
    fontSize: 48,
    color: theme.primaryColor,
    textAlign: 'center',
    padding: 5,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.white,
    width: stageWidth,
    marginHorizontal: stageMargin,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
