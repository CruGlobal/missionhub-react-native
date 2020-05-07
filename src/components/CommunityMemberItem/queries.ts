import gql from 'graphql-tag';

export const COMMUNITY_MEMBER_PERSON_FRAGMENT = gql`
  fragment CommunityMemberPerson on Person {
    id
    firstName
    lastName
    fullName
    picture
    createdAt
  }
`;
