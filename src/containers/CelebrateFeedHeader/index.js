import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getReportedComments } from '../../actions/reportComments';
import { Flex } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { isOwner, orgIsCru, isAdmin, orgIsGlobal } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../Groups/GroupReport';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../../containers/Groups/OnboardingCard';
import {
  getUnreadComments,
  markCommentsRead,
} from '../../actions/unreadComments';
import UnreadCommentsCard from '../../components/UnreadCommentsCard';
import ReportCommentHeaderCard from '../../components/ReportCommentHeaderCard';

import styles from './styles';

class CelebrateFeedHeader extends Component {
  componentDidMount() {
    const {
      dispatch,
      organization: { id: orgId },
      shouldQueryReport,
      shouldQueryNewComments,
    } = this.props;
    if (shouldQueryReport) {
      dispatch(getReportedComments(orgId));
    }
    if (shouldQueryNewComments) {
      dispatch(getUnreadComments(orgId));
    }
  }

  closeCommentCard = () => {
    const { dispatch } = this.props;
    dispatch(markCommentsRead());
  };

  report = () => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_REPORT_SCREEN, { organization }));
  };

  commentCard = () => {
    // const { dispatch, organization } = this.props;
    // dispatch(navigatePush(GROUPS_UNREAD_COMMENTS_SCREEN, { organization }));
  };

  renderCommentCard() {
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
    const { reportedCount, isReportVisible } = this.props;
    if (!isReportVisible) {
      return null;
    }
    return (
      <ReportCommentHeaderCard onPress={this.report} count={reportedCount} />
    );
  }

  render() {
    const { isMember, isReportVisible, isCommentCardVisible } = this.props;
    return (
      <Fragment>
        {isCommentCardVisible ? null : (
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

CelebrateFeedHeader.propTypes = {
  organization: PropTypes.object.isRequired,
  isMember: PropTypes.bool,
};

export const mapStateToProps = (
  { auth, organizations, reportedComments },
  { organization = {} },
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: selectorOrg.id },
  });
  const allReportedComments = reportedComments.all[selectorOrg.id] || [];
  const reportedCount = allReportedComments.length;

  const isUserOwner = isOwner(myOrgPerm);
  const isUserAdmin = isAdmin(myOrgPerm);
  const isCruOrg = orgIsCru(selectorOrg);

  const shouldQueryReport = isCruOrg ? isUserAdmin : isUserOwner;
  const shouldQueryNewComments = !orgIsGlobal(selectorOrg);
  const newCommentsCount = 12; // TODO: Connect this to the right data

  return {
    organization: selectorOrg,
    shouldQueryReport,
    isReportVisible: shouldQueryReport && reportedCount !== 0,
    reportedCount,
    isCommentCardVisible: shouldQueryNewComments && newCommentsCount !== 0,
    shouldQueryNewComments,
    newCommentsCount,
  };
};

export default connect(mapStateToProps)(CelebrateFeedHeader);
