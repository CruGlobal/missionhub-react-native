import { StyleSheet } from 'react-native';

import theme from '../../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  contentContainer: {
    paddingLeft: 10,
    paddingRight: 25,
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
    ...theme.textRegular12,
    color: theme.lightGrey,
  },
  editedBullet: {
    paddingHorizontal: 2,
  },
  editingComment: {
    backgroundColor: theme.lightBlue,
  },
});
