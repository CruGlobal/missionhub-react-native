import theme from '../../theme';

export const markdownStyles = {
  heading1: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '300',
  },
  text: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    lineHeight: 26,
  },
  strong: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 26,
  },
  listItemBullet: {
    color: theme.textColor,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
    lineHeight: 26,
    paddingRight: 16,
    alignSelf: 'flex-start',
  },
};
