import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';

import { getReportedComments } from '../../actions/reportComments';
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

class CelebrateFeedHeader extends Component {
  componentDidMount() {
    const {
      // @ts-ignore
      dispatch,
      // @ts-ignore
      organization: { id: orgId },
      // @ts-ignore
      shouldQueryReport,
    } = this.props;
    if (shouldQueryReport) {
      dispatch(getReportedComments(orgId));
    }
  }

  closeCommentCard = () => {
    const {
      // @ts-ignore
      dispatch,
      // @ts-ignore
      organization: { id: orgId },
    } = this.props;
    dispatch(markCommentsRead(orgId));
  };

  report = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_REPORT_SCREEN, { organization }));
  };

  commentCard = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUP_UNREAD_FEED_SCREEN, { organization }));
  };

  renderCommentCard() {
    // @ts-ignore
    const { isCommentCardVisible, newCommentsCount } = this.props;
    if (!isCommentCardVisible) {
      return null;
    }
    return (
      <UnreadCommentsCard
        count={newCommentsCount}
        onPress={this.commentCard}
        onClose={this.closeCommentCard}
      />
    );
  }

  renderReport() {
    // @ts-ignore
    const { reportedCount, isReportVisible } = this.props;
    if (!isReportVisible) {
      return null;
    }
    return (
      <ReportCommentHeaderCard onPress={this.report} count={reportedCount} />
    );
  }

  render() {
    // @ts-ignore
    const { isMember, isReportVisible, isCommentCardVisible } = this.props;
    return (
      <Fragment>
        {isCommentCardVisible ? null : (
          // @ts-ignore
          <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />
        )}
        {isMember || (!isReportVisible && !isCommentCardVisible) ? null : (
          <Flex style={styles.itemWrap}>
            {this.renderCommentCard()}
            {isReportVisible && isCommentCardVisible ? (
              <Flex style={styles.bothPadding} />
            ) : null}
            {this.renderReport()}
          </Flex>
        )}
      </Fragment>
    );
  }
}

// @ts-ignore
CelebrateFeedHeader.propTypes = {
  organization: PropTypes.object.isRequired,
  isMember: PropTypes.bool,
};

export const mapStateToProps = (
  // @ts-ignore
  { auth, organizations, reportedComments },
  { organization = {} },
) => {
  const selectorOrg =
    // @ts-ignore
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  // @ts-ignore
  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: selectorOrg.id },
  });
  const allReportedComments = reportedComments.all[selectorOrg.id] || [];
  const reportedCount = allReportedComments.length;

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
