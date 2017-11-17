import { StyleSheet } from 'react-native';
import {PRIMARY_HEADER_COLOR} from './theme';

export default StyleSheet.create({
  primaryButtonTextStyle: {
    fontSize: 18, fontFamily: 'SourceSansPro-Bold', color: 'white', letterSpacing: 2,
  },
  primaryButtonStyle: {
    alignItems: 'center',
    backgroundColor: PRIMARY_HEADER_COLOR,
    minHeight: 50,
  },

  primaryHeaderStyle: {
    fontFamily: 'AmaticSC-Bold',
    color: PRIMARY_HEADER_COLOR,
  },

  primaryTextStyle: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    color: 'white',
  },
});
