import gql from 'graphql-tag';

export const CELEBRATE_ITEM_PERSON_FRAGMENT = gql`
  fragment CelebrateItemPerson on Person {
    id
    firstName
    lastName
  }
`;

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
      ...CelebrateItemPerson
    }
    subjectPersonName
  }
  ${CELEBRATE_ITEM_PERSON_FRAGMENT}
`;
