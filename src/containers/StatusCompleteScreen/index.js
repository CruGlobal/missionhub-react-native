import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Button } from '../../components/common';
import { navigatePush, navigateBack } from '../../actions/navigation';
import Header from '../Header';
import BackButton from '../BackButton';
import { STATUS_REASON_SCREEN } from '../StatusReasonScreen';

import styles from './styles';

@translate('statusComplete')
class StatusCompleteScreen extends Component {
  onSubmitReason = () => {
    this.props.dispatch(navigateBack(4));
  };

  cancel = () => {
    const { dispatch, person, contactAssignment, organization } = this.props;
    dispatch(
      navigatePush(STATUS_REASON_SCREEN, {
        person,
        organization,
        contactAssignment,
        onSubmit: this.onSubmitReason,
      }),
    );
  };

  complete = () => {
    const { dispatch } = this.props;
    dispatch(navigateBack(2));
  };

  render() {
    const { t, me, person } = this.props;

    return (
      <View style={styles.container}>
        <Header left={<BackButton />} shadow={false} />

        <Flex value={1} align="stretch" style={styles.content}>
          <Text style={styles.text}>
            {t('continue', {
              userName: me.first_name,
              statusName: person.first_name,
            })}
          </Text>
          <Button
            type="transparent"
            onPress={this.complete}
            text={t('totally').toUpperCase()}
            style={styles.button}
            buttonTextStyle={styles.buttonText}
          />
          <Button
            type="transparent"
            onPress={this.cancel}
            text={t('nope').toUpperCase()}
            style={styles.button}
            buttonTextStyle={styles.buttonText}
          />
        </Flex>
      </View>
    );
  }
}

StatusCompleteScreen.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.person,
});

export default connect(mapStateToProps)(StatusCompleteScreen);
export const STATUS_COMPLETE_SCREEN = 'nav/STATUS_COMPLETE';
