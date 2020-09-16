import gql from 'graphql-tag';

export const AUTH_PERSON = gql`
  query AuthPerson {
    currentUser {
      id
      person {
        id
        fullName
        firstName
        lastName
        stage {
          id
          selfFollowupDescription
        }
        globalRegistryMdmId
        fbUid
        theKeyUid
      }
    }
  }
`;
