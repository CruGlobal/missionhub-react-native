import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.primaryColor },
  headerButton: { marginHorizontal: 4 },
  skipText: { color: theme.secondaryColor },
  contentWrap: { alignItems: 'center' },
  nullHeaderText: {
    ...theme.textLight24,
    color: theme.white,
    marginTop: 48,
  },
  imageHeaderText: {
    ...theme.textLight24,
    marginTop: 24,
    color: theme.white,
  },
  descriptionText: {
    ...theme.textRegular14,
    marginTop: 12,
    color: theme.white,
    marginHorizontal: 40,
    textAlign: 'center',
  },
  profileIconWrap: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: theme.white,
    borderRadius: 53,
    width: 109,
    height: 109,
    top: theme.fullHeight / 2.0 - 53,
    left: theme.fullWidth / 2.0 - 53,
  },
  profileIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  profilePlusIcon: {
    position: 'absolute',
    bottom: -3,
    right: -3,
  },
  nullBottomButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.fullWidth - 100,
    height: 48,
    backgroundColor: theme.secondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  bottomButtonText: {
    ...theme.textBold14,
    color: theme.white,
    textAlign: 'center',
    letterSpacing: 1.5,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  imageBottomButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.fullWidth - 100,
    height: 48,
    backgroundColor: theme.secondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginTop: 44,
  },
  image: {
    marginTop: 48,
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    ...theme.textRegular14,
    color: theme.secondaryColor,
  },
});
