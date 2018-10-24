import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { getMyPeople } from '../../actions/people';
import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';
import { isMissionhubUser, communityIsCru } from '../../utils/common';

import styles from './styles';

@translate()
export class PeopleItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMe: props.person.id === props.me.id,
      isPersonal: props.organization && props.organization.id === 'personal',
    };
  }

  handleSelect = () =>
    this.props.onSelect(this.props.person, this.props.organization);

  handleChangeStage = () => {
    const { me, dispatch, person, organization } = this.props;

    const contactAssignment = (person.reverse_contact_assignments || []).find(
      a => a.assigned_to.id === me.id,
    );
    const contactAssignmentId = contactAssignment && contactAssignment.id;

    dispatch(
      navigatePush(PERSON_STAGE_SCREEN, {
        onComplete: () => dispatch(getMyPeople()),
        currentStage: null,
        name: person.first_name,
        contactId: person.id,
        contactAssignmentId: contactAssignmentId,
        section: 'people',
        subsection: 'person',
        orgId: organization.id,
      }),
    );
  };

  render() {
    const { person, me, t, stagesObj, organization } = this.props;
    const { isPersonal, isMe } = this.state;
    const newPerson = isMe ? me : person;
    let personName = isMe ? t('me') : newPerson.full_name || '';
    personName = personName.toUpperCase();

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

    const isCruOrg = communityIsCru(organization);

    let status = 'uncontacted';

    const orgPermissions = person.organizational_permissions || [];
    if (isMe || !isCruOrg) {
      status = '';
    } else if (isCruOrg) {
      const personOrgPermissions = orgPermissions.find(
        o => o.organization_id === organization.id,
      );
      if (personOrgPermissions) {
        if (isMissionhubUser(personOrgPermissions)) {
          status = '';
        } else {
          status = personOrgPermissions.followup_status || '';
        }
      }
    }

    const isUncontacted = status === 'uncontacted';

    return (
      <Touchable highlight={true} onPress={this.handleSelect}>
        <Flex direction="row" align="center" style={styles.row}>
          <Flex justify="center" value={1}>
            <Text style={styles.name}>{personName}</Text>
            <Flex direction="row" align="center">
              <Text style={styles.stage}>{stage ? stage.name : ''}</Text>
              <Text style={styles.stage}>
                {stage && status ? '  >  ' : null}
              </Text>
              <Text
                style={[
                  styles.stage,
                  isUncontacted ? styles.uncontacted : null,
                ]}
              >
                {t(status ? `followupStatus.${status.toLowerCase()}` : null)}
              </Text>
            </Flex>
          </Flex>
          {!isPersonal && !stage && !isMe ? (
            <Touchable isAndroidOpacity={true} onPress={this.handleChangeStage}>
              <Icon
                name="journeyIcon"
                type="MissionHub"
                style={styles.uncontactedIcon}
              />
            </Touchable>
          ) : null}
        </Flex>
      </Touchable>
    );
  }
}

PeopleItem.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    gender: PropTypes.string,
    student_status: PropTypes.string,
    campus: PropTypes.string,
    year_in_school: PropTypes.string,
    major: PropTypes.string,
    minor: PropTypes.string,
    birth_date: PropTypes.string,
    date_became_christian: PropTypes.string,
    graduation_date: PropTypes.string,
    picture: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  organization: PropTypes.object,
};

const mapStateToProps = ({ auth, stages }) => ({
  me: auth.person,
  stagesObj: stages.stagesObj,
});

export default connect(mapStateToProps)(PeopleItem);
