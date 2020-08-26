import gql from 'graphql-tag';

export const SIGN_IN_WITH_THE_KEY_MUTATION = gql`
  mutation SignInWithTheKey($accessToken: String!, $anonymousUid: String) {
    loginWithTheKey(
      input: { keyAccessToken: $accessToken, anonymousUid: $anonymousUid }
    ) {
      token
    }
  }
`;

export const SIGN_IN_WITH_FACEBOOK_MUTATION = gql`
  mutation SignInWithFacebook($accessToken: String!, $anonymousUid: String) {
    loginWithFacebook(
      input: { fbAccessToken: $accessToken, anonymousUid: $anonymousUid }
    ) {
      token
    }
  }
`;

export const SIGN_IN_WITH_APPLE_MUTATION = gql`
  mutation SignInWithApple(
    $appleIdToken: String!
    $firstName: String
    $lastName: String
    $anonymousUid: String
  ) {
    loginWithApple(
      input: {
        appleIdToken: $appleIdToken
        firstName: $firstName
        lastName: $lastName
        anonymousUid: $anonymousUid
      }
    ) {
      token
    }
  }
`;

export const SIGN_UP_WITH_ANONYMOUS_MUTATION = gql`
  mutation SignUpWithAnonymous($firstName: String!, $lastName: String) {
    createAnonymousUser(input: { firstName: $firstName, lastName: $lastName }) {
      token
      anonymousUid
    }
  }
`;

export const SIGN_IN_WITH_ANONYMOUS_MUTATION = gql`
  mutation SignInWithAnonymous($anonymousUid: String!) {
    loginWithAnonymous(input: { anonymousUid: $anonymousUid }) {
      token
    }
  }
`;
