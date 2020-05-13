import { StyleSheet } from 'react-native';

import theme from '../../../../theme';

export default StyleSheet.create({
  container: {
    shadowColor: theme.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backgroundColor: theme.grey3,
  },
  image: { height: 210 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.black,
    opacity: 0.15,
  },
  communityName: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
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
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 20,
    color: theme.white,
  },
});
