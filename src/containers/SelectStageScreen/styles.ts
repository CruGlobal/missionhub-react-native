import { StyleSheet } from 'react-native';

import theme from '../../theme';

const screenMargin = 60;
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
    backgroundColor: theme.secondaryColor,
  },
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.textBold16,
    color: theme.primaryColor,
    fontSize: 18,
    lineHeight: 24,
    paddingBottom: 25,
    paddingTop: 45,
    paddingHorizontal: 30,
    width: theme.fullWidth - 100,
    textAlign: 'center',
  },
  cardText: {
    ...theme.textRegular16,
    textAlign: 'center',
    padding: 5,
  },
  cardHeader: {
    ...theme.textAmatic42,
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
