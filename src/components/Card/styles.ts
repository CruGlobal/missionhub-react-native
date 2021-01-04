import { StyleSheet } from 'react-native';

import theme from '../../theme';

export const CardVerticalMargin = 8;
const CardHorizontalMargin = 16;

export default StyleSheet.create({
  card: {
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    borderRadius: 8,
    marginHorizontal: CardHorizontalMargin,
    marginVertical: CardVerticalMargin,
    flexDirection: 'row',
    backgroundColor: theme.white,
    alignItems: 'center',
  },
});
