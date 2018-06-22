import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Button, Touchable, Icon } from '../../components/common';
import Header from '../Header';
import { orgPermissionSelector } from '../../selectors/people';
import {
  // createContactAssignment,
  // deleteContactAssignment,
  updateFollowupStatus,
} from '../../actions/person';
import { navigateBack } from '../../actions/navigation';

import styles from './styles';

@translate('statusSelect')
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

  submit = () => {
    const { dispatch, person, orgPermission, status } = this.props;
    const { selected } = this.state;
    if (status === selected) {
      dispatch(navigateBack());
      return;
    }
    dispatch(updateFollowupStatus(person, orgPermission.id, selected));
  };

  render() {
    const { t, dispatch } = this.props;
    const { selected } = this.state;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Header
          left={
            <Button
              text={t('cancel').toUpperCase()}
              type="transparent"
              onPress={() => dispatch(navigateBack())}
              style={styles.headerButton}
              buttonTextStyle={styles.headerButtonText}
            />
          }
          right={
            <Button
              text={t('done').toUpperCase()}
              type="transparent"
              onPress={this.submit}
              style={styles.headerButton}
              buttonTextStyle={styles.headerButtonText}
            />
          }
          title={t('header')}
        />

        <Flex value={1} align="stretch" justify="end">
          <Touchable
            onPress={() => this.select('uncontacted')}
            style={styles.row}
          >
            <Text
              style={[
                styles.text,
                selected === 'uncontacted' ? styles.selected : null,
              ]}
            >
              {t('uncontacted')}
            </Text>
            {selected === 'uncontacted' ? (
              <Icon
                name="checkIcon"
                size={22}
                type="MissionHub"
                style={styles.icon}
              />
            ) : null}
          </Touchable>
        </Flex>
      </Flex>
    );
  }
}

StatusSelectScreen.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export const mapStateToProps = (reduxState, { navigation }) => {
  const navParams = navigation.state.params || {};
  const person = navParams.person;
  const orgPermission = orgPermissionSelector(null, {
    person,
    organization: navParams.organization,
  });

  return {
    ...navParams,
    person,
    orgPermission: orgPermission,
    status: orgPermission.followup_status,
  };
};

export default connect(mapStateToProps)(StatusSelectScreen);
export const STATUS_SELECT_SCREEN = 'nav/STATUS_SELECT';
