import { StyleSheet } from 'react-native';

import { PRIMARY_BACKGROUND_COLOR, PRIMARY_HEADER_COLOR } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_BACKGROUND_COLOR,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  label: {
    color: PRIMARY_HEADER_COLOR,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 12,
  },
  input: {
    color: 'white',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    letterSpacing: .25,
    borderBottomColor: PRIMARY_HEADER_COLOR,
  },
});
