import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { getReportedComments } from '../../actions/reportComments';
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
import ReportCommentHeaderCard from '../../components/ReportCommentHeaderCard';
import { GROUP_UNREAD_FEED_SCREEN } from '../Groups/GroupUnreadFeed';
import { AuthState } from '../../reducers/auth';
import { OrganizationsState, Organization } from '../../reducers/organizations';
import { ReportedCommentsState } from '../../reducers/reportedComments';

import styles from './styles';

export interface CelebrateFeedHeaderProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  organization: Organization;
  shouldQueryReport: boolean;
  isReportVisible: boolean;
  isCommentCardVisible: boolean;
  isMember: boolean;
  reportedCount: number;
  newCommentsCount: number;
}

const CelebrateFeedHeader = ({
  dispatch,
  organization,
  shouldQueryReport,
  isReportVisible,
  isCommentCardVisible,
  isMember,
  reportedCount,
  newCommentsCount,
}: CelebrateFeedHeaderProps) => {
  useEffect(() => {
    shouldQueryReport && dispatch(getReportedComments(organization.id));
  }, []);

  const closeCommentCard = () => {
    dispatch(markCommentsRead(organization.id));
  };

  const report = () => {
    dispatch(navigatePush(GROUPS_REPORT_SCREEN, { organization }));
  };

  const commentCard = () => {
    dispatch(navigatePush(GROUP_UNREAD_FEED_SCREEN, { organization }));
  };

  const renderCommentCard = () => {
    if (!isCommentCardVisible) {
      return null;
    }

    return (
      <UnreadCommentsCard
        //@ts-ignore
        testID="UnreadCommentsCard"
        count={newCommentsCount}
        onPress={commentCard}
        onClose={closeCommentCard}
      />
    );
  };

  const renderReport = () => {
    if (!isReportVisible) {
      return null;
    }

    return (
      <ReportCommentHeaderCard
        //@ts-ignore
        testID="ReportCommentCard"
        onPress={report}
        count={reportedCount}
      />
    );
  };

  return (
    <Fragment>
      {isCommentCardVisible ? null : (
        //@ts-ignore
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
    </Fragment>
  );
};

export const mapStateToProps = (
  {
    auth,
    organizations,
    reportedComments,
  }: {
    auth: AuthState;
    organizations: OrganizationsState;
    reportedComments: ReportedCommentsState;
  },
  { organization }: { organization: Organization },
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

  const reportedCount = (reportedComments.all[selectorOrg.id] || []).length;

  const shouldQueryReport = shouldQueryReportedComments(selectorOrg, myOrgPerm);
  const newCommentsCount = selectorOrg.unread_comments_count;

  return {
    organization: selectorOrg,
    shouldQueryReport,
    isReportVisible: shouldQueryReport && reportedCount !== 0,
    reportedCount,
    isCommentCardVisible:
      !orgIsGlobal(selectorOrg) && newCommentsCount && newCommentsCount !== 0,
    newCommentsCount,
  };
};

export default connect(mapStateToProps)(CelebrateFeedHeader);
