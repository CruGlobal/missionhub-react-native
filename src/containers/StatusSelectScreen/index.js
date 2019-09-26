import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Flex, Text, Button, Touchable, Icon } from '../../components/common';
import Header from '../../components/Header';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
  personSelector,
} from '../../selectors/people';
import { updateFollowupStatus } from '../../actions/person';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { STATUS_COMPLETE_SCREEN } from '../StatusCompleteScreen';

import styles from './styles';

@withTranslation('statusSelect')
class StatusSelectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.status,
    };
  }

  select = status => {
    this.setState({ selected: status });
  };

  submit = async () => {
    const {
      dispatch,
      person,
      organization,
      contactAssignment,
      orgPermission,
      status,
    } = this.props;
    const { selected } = this.state;
    if (status === selected) {
      dispatch(navigateBack());
      return;
    }
    await dispatch(updateFollowupStatus(person, orgPermission.id, selected));
    if (selected === 'completed' || selected === 'do_not_contact') {
      dispatch(
        navigatePush(STATUS_COMPLETE_SCREEN, {
          organization,
          person,
          contactAssignment,
        }),
      );
    }
  };

  renderItem(type) {
    const { t } = this.props;
    const { selected } = this.state;
    return (
      <Touchable pressProps={[type]} onPress={this.select} style={styles.row}>
        <Text style={[styles.text, selected === type ? styles.selected : null]}>
          {t(type)}
        </Text>
        {selected === type ? (
          <Icon
            name="checkIcon"
            size={16}
            type="MissionHub"
            style={styles.icon}
          />
        ) : null}
      </Touchable>
    );
  }

  navigateBack = () => this.props.dispatch(navigateBack());

  render() {
    const { t } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Header
          left={
            <Button
              text={t('cancel').toUpperCase()}
              type="transparent"
              onPress={this.navigateBack}
              style={styles.headerButton}
              buttonTextStyle={[
                styles.headerButtonText,
                styles.headerButtonTextCancel,
              ]}
            />
          }
          right={
            <Button
              text={t('done').toUpperCase()}
              type="transparent"
              onPress={this.submit}
              style={styles.headerButton}
              buttonTextStyle={[
                styles.headerButtonText,
                styles.headerButtonTextDone,
              ]}
            />
          }
          title={t('header')}
        />
        <Flex value={1} align="stretch" style={styles.listWrap}>
          {this.renderItem('uncontacted')}
          {this.renderItem('attempted_contact')}
          {this.renderItem('contacted')}
          {this.renderItem('completed')}
          {this.renderItem('do_not_contact')}
        </Flex>
      </SafeAreaView>
    );
  }
}

StatusSelectScreen.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export const mapStateToProps = ({ auth, people }, { navigation }) => {
  const navParams = navigation.state.params || {};
  const { person: navPerson = {}, organization: navOrg = {} } = navParams;
  const orgId = navOrg.id;
  const person =
    personSelector({ people }, { personId: navPerson.id, orgId }) || navPerson;
  const organization = navOrg;
  const orgPermission = orgPermissionSelector(null, {
    person,
    organization,
  });

  return {
    ...navParams,
    person,
    organization,
    orgPermission: orgPermission,
    contactAssignment: contactAssignmentSelector({ auth }, { person, orgId }),
    status: orgPermission.followup_status,
  };
};

export default connect(mapStateToProps)(StatusSelectScreen);
export const STATUS_SELECT_SCREEN = 'nav/STATUS_SELECT';
