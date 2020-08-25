import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  container: {
    backgroundColor: theme.extraLightGrey,
  },
  image: { height: 210 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.black,
    opacity: 0.15,
  },
  communityName: {
    ...theme.textLight24,
    color: theme.white,
  },
  communityMembersButton: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 30,
    borderColor: theme.white,
    borderWidth: 1,
    marginBottom: 10,
  },
  communityMembersText: {
    ...theme.textRegular14,
    fontWeight: 'normal',
    color: theme.white,
  },
});
