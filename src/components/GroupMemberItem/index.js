import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { ORG_PERMISSIONS } from '../../constants';
import { Flex, Text, Dot, Card } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { orgIsUserCreated, isAdminOrOwner, isOwner } from '../../utils/common';

import styles from './styles';

@translate('groupItem')
class GroupMemberItem extends Component {
  handleSelect = () => {
    const { onSelect, person } = this.props;
    onSelect && onSelect(person);
  };

  orgPermissionText = () => {
    const { t, personOrgPermission } = this.props;

    switch (personOrgPermission.permission_id) {
      case ORG_PERMISSIONS.ADMIN:
        return t('profileLabels.admin');
      case ORG_PERMISSIONS.OWNER:
        return t('profileLabels.owner');
      default:
        return '';
    }
  };

  renderUserCreatedDetails = isMe => {
    const { t, stagesObj, me, person } = this.props;

    let stage = null;

    const contactAssignments = person.reverse_contact_assignments || [];
    if (isMe) {
      stage = me.stage;
    } else if (stagesObj) {
      const contactAssignment = contactAssignments.find(
        a => a.assigned_to.id === me.id,
      );
      if (
        contactAssignment &&
        contactAssignment.pathway_stage_id &&
        stagesObj[`${contactAssignment.pathway_stage_id}`]
      ) {
        stage = stagesObj[`${contactAssignment.pathway_stage_id}`];
      }
    }

    const permissionText = this.orgPermissionText();

    return (
      <Fragment>
        {stage ? (
          <Text style={styles.detailText}>{stage.name}</Text>
        ) : (
          <Text style={styles.detailTextRed}>{t('selectStage')}</Text>
        )}
        {permissionText ? (
          <Fragment>
            <Dot style={styles.detailText} />
            <Text style={styles.detailText}>{this.orgPermissionText()}</Text>
          </Fragment>
        ) : null}
      </Fragment>
    );
  };

  renderCruDetails = () => {
    const { t, person } = this.props;

    return (
      <Fragment>
        <Text style={styles.detailText}>
          {t('numAssigned', { count: person.contact_count || 0 })}
        </Text>
        {person.uncontacted_count ? (
          <Fragment>
            <Dot style={styles.detailText} />
            <Text style={styles.detailTextRed}>
              {t('numUncontacted', {
                count: person.uncontacted_count,
              })}
            </Text>
          </Fragment>
        ) : null}
      </Fragment>
    );
  };

  render() {
    const {
      me,
      person,
      organization,
      iAmAdmin,
      iAmOwner,
      personIsAdmin,
      personIsOwner,
      isUserCreatedOrg,
      personOrgPermission,
    } = this.props;

    const isMe = person.id === me.id;
    const showOptionsMenu = isMe || (iAmAdmin && !personIsOwner);

    return (
      <Card onPress={this.handleSelect}>
        <Flex
          justify="center"
          align="center"
          direction="row"
          style={styles.content}
        >
          <Flex value={1} direction="column">
            <Text style={styles.name}>{person.full_name.toUpperCase()}</Text>
            <Flex align="center" direction="row" style={styles.detailsWrap}>
              {isUserCreatedOrg
                ? this.renderUserCreatedDetails(isMe)
                : this.renderCruDetails()}
            </Flex>
          </Flex>
          {showOptionsMenu ? (
            <MemberOptionsMenu
              myId={me.id}
              person={person}
              organization={organization}
              personOrgPermission={personOrgPermission}
              iAmAdmin={iAmAdmin}
              iAmOwner={iAmOwner}
              personIsAdmin={personIsAdmin}
            />
          ) : null}
        </Flex>
      </Card>
    );
  }
}

GroupMemberItem.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    contact_count: PropTypes.number,
    uncontacted_count: PropTypes.number,
  }).isRequired,
  organization: PropTypes.object.isRequired,
  myOrgPermission: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
};

const mapStateToProps = (
  { auth, stages },
  { person, organization, myOrgPermission },
) => {
  const personOrgPermission = orgPermissionSelector(null, {
    person,
    organization,
  });

  return {
    me: auth.person,
    stagesObj: stages.stagesObj,
    iAmAdmin: isAdminOrOwner(myOrgPermission),
    iAmOwner: isOwner(myOrgPermission),
    personIsAdmin: isAdminOrOwner(personOrgPermission),
    personIsOwner: isOwner(personOrgPermission),
    isUserCreatedOrg: orgIsUserCreated(organization),
    personOrgPermission,
  };
};

export default connect(mapStateToProps)(GroupMemberItem);
