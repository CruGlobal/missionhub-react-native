import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../../components/common';
import styles from './styles';
import { getStages } from '../../actions/stages';
import { capitalize } from '../../utils/common';

@translate()
export class PeopleItem extends Component {

  componentDidMount() {
    const { person, me, dispatch } = this.props;
    if (person.id === me.id && !me.stage) {
      dispatch(getStages());
    }
  }

  handleSelect = () => { this.props.onSelect(this.props.person); }

  render() {
    const { t } = this.props;

    const { person, me, stagesObj } = this.props;
    const isMe = person.id === me.id;
    const newPerson = isMe ? me : person;
    let personName = isMe ? t('me') : newPerson.full_name || '';
    personName = personName.toUpperCase();

    let status = 'Uncontacted';
    let personStage = '';
    let isUncontacted = true;

    const orgPermissions = newPerson.organizational_permissions;
    const contactAssignments = newPerson.reverse_contact_assignments;
    if (isMe) {
      personStage = me.stage ? me.stage.name : '';
      status = '';
      isUncontacted = false;
    } else {
      if (orgPermissions && orgPermissions[0] && orgPermissions[0].followup_status) {
        status = capitalize(orgPermissions[0].followup_status);
        if (status !== 'Uncontacted') {
          isUncontacted = false;
        }
      }
      if (contactAssignments && contactAssignments[0]) {
        if (contactAssignments[0].assigned_to.id === me.id
          && contactAssignments[0].pathway_stage_id
          && stagesObj[`${contactAssignments[0].pathway_stage_id}`]) {
          personStage = stagesObj[`${contactAssignments[0].pathway_stage_id}`].name;
        }
      }
    }

    return (
      <Touchable highlight={true} onPress={this.handleSelect}>
        <Flex direction="row" align="center" style={styles.row}>
          <Flex justify="center" value={1}>
            <Text style={styles.name}>
              {personName}
            </Text>
            <Text style={[ styles.stage, isUncontacted ? styles.uncontacted : null ]}>
              {personStage}
              {personStage && status ? '  >  ' : null}
              {t(status ? `followupStatus.${status.toLowerCase()}` : null)}
            </Text>
          </Flex>
          {
            !personStage ? (
              <Icon name="journeyIcon" type="MissionHub" style={styles.uncontactedIcon} />
            ) : null
          }
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
};

const mapStateToProps = ({ auth, stages }) => ({
  me: auth.user,
  stagesObj: stages.stagesObj,
});

export default connect(mapStateToProps)(PeopleItem);
