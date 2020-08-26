import gql from 'graphql-tag';

export const LOCALE_AND_TIMEZONE_QUERY = gql`
  query LocaleAndTimezone {
    currentUser {
      id
      mobileLanguage
      timezone
    }
  }
`;
