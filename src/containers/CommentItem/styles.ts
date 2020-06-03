import { StyleSheet } from 'react-native';

import theme, { COLORS } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  contentContainer: {
    paddingLeft: 10,
  },
  commentHeader: { flexDirection: 'row', alignItems: 'flex-end' },
  name: {
    paddingRight: 6,
  },
  commentBody: {
    alignSelf: 'flex-start',
    backgroundColor: theme.extraLightGrey,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 13,
    marginVertical: 5,
  },
  edited: {
    color: theme.grey1,
    fontSize: 12,
  },
  editedBullet: {
    paddingHorizontal: 2,
  },
  editingComment: {
    backgroundColor: COLORS.GLACIER_BLUE,
  },
});
