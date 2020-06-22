import gql from 'graphql-tag';

import { REPORTED_ITEM_FRAGMENT } from '../../../../containers/ReportedItem/queries';

export const GET_CONTENT_COMPLAINT = gql`
  query GetContentComplaint($id: ID!, $commentsCursor: String) {
    contentComplaint(id: $id) {
      ...ReportedItem
    }
  }
  ${REPORTED_ITEM_FRAGMENT}
`;
