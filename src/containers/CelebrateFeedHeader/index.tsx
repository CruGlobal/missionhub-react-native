import React from 'react';
import { connect } from 'react-redux-legacy';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';

import { GET_REPORTED_CONTENT } from '../Groups/GroupReport';
import { Flex } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { orgIsGlobal, shouldQueryReportedComments } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../Groups/GroupReport';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { markCommentsRead } from '../../actions/unreadComments';
import UnreadCommentsCard from '../../components/UnreadCommentsCard';
import ReportItemHeaderCard from '../../components/ReportItemHeaderCard';
import { GROUP_UNREAD_FEED_SCREEN } from '../Groups/GroupUnreadFeed';
import { Organization, OrganizationsState } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';

import styles from './styles';

interface CelebrateFeedHeaderProps {
  shouldQueryReport: boolean;
  organization: Organization;
  isMember: boolean;
}

const CelebrateFeedHeader = ({
  shouldQueryReport,
  organization,
  isMember,
}: CelebrateFeedHeaderProps) => {
  const dispatch = useDispatch();
  const { id: orgId } = organization;

  const {
    data: {
      community: {
        contentComplaints: { nodes: ReportedContent = [] } = {},
      } = {},
    } = {},
    loading,
    refetch,
  } = useQuery(GET_REPORTED_CONTENT, {
    variables: {
      id: orgId,
    },
  });
  const unreadCommentCount = organization.unread_comments_count;
  const reportedContentCount = ReportedContent.length;
  const isReportVisible = shouldQueryReport && reportedContentCount !== 0;
  const isCommentCardVisible =
    !orgIsGlobal(organization) && unreadCommentCount !== 0;

  const closeCommentCard = () => {
    dispatch(markCommentsRead(orgId));
    refetch();
  };

  const report = () => {
    dispatch(navigatePush(GROUPS_REPORT_SCREEN, { organization }));
  };

  const commentCard = () => {
    dispatch(navigatePush(GROUP_UNREAD_FEED_SCREEN, { organization }));
  };

  const renderCommentCard = () => {
    if (unreadCommentCount === 0) {
      return null;
    }

    return (
      <UnreadCommentsCard
        testID="UnreadCommentsCard"
        count={unreadCommentCount}
        onPress={commentCard}
        onClose={closeCommentCard}
      />
    );
  };

  const renderReport = () => {
    if (loading || reportedContentCount === 0) {
      return null;
    }
    return (
      <ReportItemHeaderCard
        testID="ReportItemCard"
        onPress={report}
        count={reportedContentCount}
      />
    );
  };

  return (
    <>
      {isCommentCardVisible ? null : (
        //@ts-ignore
        <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />
      )}
      {!isMember ? (
        <Flex style={styles.itemWrap}>
          {!isCommentCardVisible ? null : renderCommentCard()}
          {isReportVisible && isCommentCardVisible ? (
            <Flex style={styles.bothPadding} />
          ) : null}
          {!isReportVisible ? null : renderReport()}
        </Flex>
      ) : null}
    </>
  );
};

export const mapStateToProps = (
  {
    auth,
    organizations,
  }: { auth: AuthState; organizations: OrganizationsState },
  { organization = {} }: { organization: Organization },
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  const myOrgPerm = orgPermissionSelector(
    {},
    {
      person: auth.person,
      organization: { id: selectorOrg.id },
    },
  );
  const shouldQueryReport = shouldQueryReportedComments(selectorOrg, myOrgPerm);

  return {
    organization: selectorOrg,
    shouldQueryReport,
  };
};

export default connect(mapStateToProps)(CelebrateFeedHeader);
