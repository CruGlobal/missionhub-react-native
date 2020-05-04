import gql from 'graphql-tag';

export const COMMUNITY_MEMBER_ITEM_FRAGMENT = gql`
  fragment CommunityMemberItem on Person {
    id
    firstName
    lastName
    fullName
    picture
    createdAt
  }
`;
