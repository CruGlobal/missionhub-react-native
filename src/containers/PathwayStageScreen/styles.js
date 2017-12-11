import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
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
    width: theme.fullWidth - 120,
    marginHorizontal: theme.fullWidth / 30,
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
    height: theme.fullHeight / 2,
  },
});
