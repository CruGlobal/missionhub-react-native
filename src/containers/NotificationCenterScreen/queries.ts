import gql from 'graphql-tag';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications(sortBy: createdAt_DESC) {
      nodes {
        id
        createdAt
        messageTemplate
        trigger
        subjectPerson {
          id
          fullName
          picture
        }
        messageVariables {
          challengeName
          organizationCount
          organizationName
          originalPoster
          postType
          subjectPerson
          user
        }
      }
    }
  }
`;
