
import { StyleSheet } from 'react-native';
// import theme from '../../theme';

export default StyleSheet.create({
  tabs: {
    height: 50,
    flexDirection: 'row',
    marginVertical: 10,
  },
  tabsHidden: {
    height: 0,
    marginVertical: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
  },
  tabText: {
    fontSize: 11,
    paddingTop: 3,
  },
});
