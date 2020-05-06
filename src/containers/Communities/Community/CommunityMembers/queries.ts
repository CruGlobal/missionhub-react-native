import gql from 'graphql-tag';

import { COMMUNITY_MEMBER_PERSON_FRAGMENT } from '../../../../components/CommunityMemberItem/queries';

export const COMMUNITY_MEMBERS_QUERY = gql`
  query CommunityMembers($id: ID!, $after: String) {
    community(id: $id) {
      userCreated
      report(period: "P99Y") {
        memberCount
      }
      people(
        after: $after
        first: 25
        permissions: [owner, admin, user]
        sortBy: firstName_ASC
      ) {
        edges {
          communityPermission {
            id
            permission
          }
          node {
            ...CommunityMemberPerson
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${COMMUNITY_MEMBER_PERSON_FRAGMENT}
`;
