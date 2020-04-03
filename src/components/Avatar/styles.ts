import { StyleSheet } from 'react-native';

import theme from '../../theme';

const SIZES = { small: 24, medium: 48, large: 96 };
export default StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  small: {
    width: SIZES.small,
    height: SIZES.small,
    borderWidth: 1,
    borderColor: theme.white,
    borderRadius: SIZES.small / 2,
  },
  medium: {
    width: SIZES.medium,
    height: SIZES.medium,
    borderRadius: SIZES.medium / 2,
  },
  large: {
    width: SIZES.large,
    height: SIZES.large,
    borderRadius: SIZES.large / 2,
  },
  image: { width: '100%', height: '100%' },
  smallImage: { borderRadius: SIZES.small / 2 },
  mediumImage: { borderRadius: SIZES.medium / 2 },
  largeImage: { borderRadius: SIZES.large / 2 },
  text: { color: theme.white },
  smallText: { fontSize: 12 },
  mediumText: { fontSize: 26, fontWeight: '300' },
  largeText: { fontSize: 64, fontWeight: '300' },
});
