import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getReportedComments } from '../../actions/reportComments';
import { Flex, Text, Card, Icon } from '../../components/common';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import { isOwner, orgIsCru, isAdmin } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../Groups/GroupReport';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../../containers/Groups/OnboardingCard';

import styles from './styles';

@translate('groupsReport')
class CelebrateFeedHeader extends Component {
  componentDidMount() {
    const { dispatch, organization, shouldQueryReport } = this.props;
    if (shouldQueryReport) {
      dispatch(getReportedComments(organization.id));
    }
  }

  report = () => {
    const { dispatch, organization } = this.props;
    dispatch(navigatePush(GROUPS_REPORT_SCREEN, { organization }));
  };

  commentCard = () => {
    console.log('comment card');
    // const { dispatch, organization } = this.props;
    // dispatch(navigatePush(GROUPS_REPORT_SCREEN, { organization }));
  };

  renderCommentCard() {
    const { isCommentCardVisible } = this.props;
    if (!isCommentCardVisible) {
      return null;
    }
    return (
      <Card onPress={this.commentCard} style={styles.commentCard}>
        <Flex>
          <Flex style={styles.commentCardContent}>
            <Text style={styles.commentCardNumber}>12</Text>
            <Text style={styles.commentCardDescription}>comments</Text>
          </Flex>
          <Text style={styles.itemText}>VIEW -></Text>
        </Flex>
      </Card>
    );
  }

  renderReport() {
    const { t, count, isReportVisible } = this.props;
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
        <Text style={styles.itemText}>{t('reports', { count })}</Text>
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
  const count = allReportedComments.length;

  const isUserOwner = isOwner(myOrgPerm);
  const isUserAdmin = isAdmin(myOrgPerm);
  const isCruOrg = orgIsCru(selectorOrg);

  const shouldQueryReport = isCruOrg ? isUserAdmin : isUserOwner;

  return {
    organization: selectorOrg,
    shouldQueryReport,
    isReportVisible: shouldQueryReport && count !== 0,
    count,
    isCommentCardVisible: true,
  };
};

export default connect(mapStateToProps)(CelebrateFeedHeader);
