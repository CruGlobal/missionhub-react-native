import React from 'react';
import { connect } from 'react-redux-legacy';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { GET_REPORTED_CONTENT } from '../Groups/GroupReport';
import { Flex } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { orgIsGlobal, shouldQueryReportedComments } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../Groups/GroupReport';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../../containers/Groups/OnboardingCard';
import { markCommentsRead } from '../../actions/unreadComments';
import UnreadCommentsCard from '../../components/UnreadCommentsCard';
import ReportCommentHeaderCard from '../../components/ReportCommentHeaderCard';
import { GROUP_UNREAD_FEED_SCREEN } from '../Groups/GroupUnreadFeed';

import styles from './styles';

const CelebrateFeedHeader = ({ isMember, shouldQueryReport, organization }) => {
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
  const UnreadCommentCount = organization.unread_comments_count;
  const ReportedContentCount = ReportedContent.length;
  const isReportVisible = shouldQueryReport && ReportedContentCount !== 0;
  const isCommentCardVisible =
    !orgIsGlobal(organization) && UnreadCommentCount !== 0;

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
    if (UnreadCommentCount === 0) {
      return null;
    }
    return (
      <UnreadCommentsCard
        count={UnreadCommentCount}
        onPress={commentCard}
        onClose={closeCommentCard}
      />
    );
  };

  const renderReport = () => {
    if (loading || ReportedContentCount === 0) {
      return null;
    }
    return (
      <ReportCommentHeaderCard onPress={report} count={ReportedContentCount} />
    );
  };

  return (
    <>
      {isCommentCardVisible ? null : (
        <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />
      )}
      {isMember || (!isReportVisible && !isCommentCardVisible) ? null : (
        <Flex style={styles.itemWrap}>
          {renderCommentCard()}
          {isReportVisible && isCommentCardVisible ? (
            <Flex style={styles.bothPadding} />
          ) : null}
          {renderReport()}
        </Flex>
      )}
    </>
  );
};

CelebrateFeedHeader.propTypes = {
  organization: PropTypes.object.isRequired,
  isMember: PropTypes.bool,
};

export const mapStateToProps = (
  { auth, organizations },
  { organization = {} },
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: selectorOrg.id },
  });

  const shouldQueryReport = shouldQueryReportedComments(selectorOrg, myOrgPerm);

  return {
    organization: selectorOrg,
    shouldQueryReport,
  };
};

export default connect(mapStateToProps)(CelebrateFeedHeader);
