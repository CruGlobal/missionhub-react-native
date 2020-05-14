import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.primaryColor },
  contentWrap: { justifyContent: 'center' },
  headerText: {
    marginTop: 48,
    color: theme.white,
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 30,
  },
  descriptionText: {
    marginTop: 12,
    color: theme.white,
    fontSize: 14,
    lineHeight: 20,
  },
  profileIconWrap: {},
  profileIcon: {
    height: 106,
    width: 106,
  },
  profileAddIcon: {
    position: 'absolute',
    height: 42,
    width: 42,
    bottom: 0,
    right: 0,
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
    margin: 0,
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
