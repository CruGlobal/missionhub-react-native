import { StyleSheet } from 'react-native';

import theme from '../../theme';

const borderRadius = 4;
export const GroupCardHeight =
  (theme.fullWidth - 32) * theme.communityImageAspectRatio;

export default StyleSheet.create({
  card: {
    borderRadius,
  },
  content: {
    height: GroupCardHeight,
    borderRadius,
  },
  userCreatedContent: {
    backgroundColor: theme.accentColor,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius,
  },
  infoWrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 13,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
  groupName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.white,
  },
  groupNumber: {
    fontSize: 12,
    color: theme.white,
  },
  joinButton: {
    backgroundColor: theme.red,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
    margin: 5,
  },
  joinButtonText: {
    fontSize: 14,
    color: theme.white,
  },
  notificationIcon: {
    color: theme.white,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -5,
    backgroundColor: theme.red,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.darkRed,
  },
});
