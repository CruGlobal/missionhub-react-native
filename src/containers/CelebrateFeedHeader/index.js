import React, { Component, Fragment } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getReportedComments } from '../../actions/reportComments';
import { Flex, Text, Card, Icon, IconButton } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { isOwner, orgIsCru, isAdmin, orgIsGlobal } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../Groups/GroupReport';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../../containers/Groups/OnboardingCard';
import theme from '../../theme';
import COMMENTS from '../../../assets/images/comments.png';
import {
  getUnreadComments,
  markCommentsRead,
} from '../../actions/unreadComments';

import styles from './styles';

@translate('celebrateFeedHeader')
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
    const { t, isCommentCardVisible, newCommentsCount } = this.props;
    if (!isCommentCardVisible) {
      return null;
    }
    return (
      <Card onPress={this.commentCard} style={styles.commentCard}>
        <Flex value={1}>
          <Flex style={styles.commentCardContent}>
            <Text style={styles.commentCardNumber}>{newCommentsCount}</Text>
            <Text style={styles.commentCardDescription}>
              {t('newComments')}
            </Text>
            <Image source={COMMENTS} style={styles.commentCardBackground} />
          </Flex>
          <Flex
            direction="row"
            align="center"
            style={styles.commentCardViewWrap}
          >
            <Text style={styles.commentCardViewText}>
              {t('view').toUpperCase()}
            </Text>
            <Icon
              name="rightArrowIcon"
              type="MissionHub"
              size={12}
              style={styles.anyIcon}
            />
          </Flex>
          <Flex style={styles.commentCardCloseWrap}>
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.closeCommentCard}
              hitSlop={theme.hitSlop(10)}
              size={13}
            />
          </Flex>
        </Flex>
      </Card>
    );
  }

  renderReport() {
    const { t, reportedCount, isReportVisible } = this.props;
    if (!isReportVisible) {
      return null;
    }
    return (
      <Card onPress={this.report} style={styles.item}>
        <Icon
          name="uncontactedIcon"
          type="MissionHub"
          size={20}
          style={styles.itemIcon}
        />
        <Text style={styles.itemText}>
          {t('reports', { count: reportedCount })}
        </Text>
      </Card>
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
