import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.primaryColor },
  headerButton: { marginHorizontal: 4 },
  skipText: { color: theme.parakeetBlue },
  contentWrap: { alignItems: 'center' },
  image: {
    marginTop: 48,
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  headerText: {
    marginTop: 24,
    color: theme.white,
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 30,
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    color: theme.parakeetBlue,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
  },
  bottomButtonWrapper: {
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
  bottomButtonText: {
    color: theme.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1.5,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});
