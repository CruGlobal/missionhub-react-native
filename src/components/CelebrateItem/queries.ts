import gql from 'graphql-tag';

export const CELEBRATE_ITEM_FRAGMENT = gql`
  fragment CelebrateItem on CommunityCelebrationItem {
    id
    adjectiveAttributeName
    adjectiveAttributeValue
    celebrateableId
    celebrateableType
    changedAttributeName
    changedAttributeValue
    commentsCount
    liked
    likesCount
    objectDescription
    subjectPerson {
      id
      firstName
      lastName
    }
    subjectPersonName
  }
`;
