import gql from 'graphql-tag';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      nodes {
        id
        createdAt
        messageTemplate
        renderedMessage
        trigger
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
