import React, { Component, Fragment } from 'react';
import { View, Keyboard, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Button, Text, Flex, Input } from '../../components/common';
import { createMyPerson, createPerson } from '../../actions/onboardingProfile';
import { getMe, updatePerson } from '../../actions/person';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import BackButton from '../BackButton';

import styles from './styles';

@translate('setup')
class SetupScreen extends Component {
  state = { id: '', firstName: '', lastName: '' };

  save = async () => {
    const { dispatch, next, me, isMe } = this.props;
    const { id, firstName, lastName } = this.state;

    if (!firstName) {
      return;
    }

    Keyboard.dismiss();

    if (id) {
      await dispatch(
        updatePerson({
          id,
          firstName,
          lastName,
        }),
      );
      dispatch(next({ personId: id, isMe }));
    } else if (isMe) {
      await dispatch(createMyPerson(firstName, lastName));
      const { id: personId } = await dispatch(getMe());

      dispatch(next({ personId, isMe }));
      this.setState({ id: personId });
    } else {
      const { response: person } = await dispatch(
        createPerson(firstName, lastName, me.id),
      );

      dispatch(next({ personId: person.id, isMe }));
      this.setState({ id: person.id });
      dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
    }
  };

  updateFirstName = t => this.setState({ firstName: t });

  updateLastName = t => this.setState({ lastName: t });

  lastNameRef = c => (this.lastName = c);

  onSubmitEditing = () => this.lastName.focus();

  render() {
    const { t, isMe } = this.props;
    const { firstName, lastName } = this.state;

    return (
      <View style={styles.container}>
        <Flex value={1} />
        <Flex value={2} align="center">
          {isMe ? (
            <Fragment>
              <Text type="header" style={styles.header}>
                {t('firstThing')}
              </Text>
              <Text type="header" style={styles.headerTwo}>
                {t('namePrompt')}
              </Text>
            </Fragment>
          ) : (
            <Image source={require('../../../assets/images/add_someone.png')} />
          )}
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>
              {isMe
                ? t('profileLabels.firstNameRequired')
                : t('profileLabels.firstNameNickname')}
            </Text>
            <Input
              onChangeText={this.updateFirstName}
              value={firstName}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={this.onSubmitEditing}
              placeholder={t('profileLabels.firstName')}
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingTop: 30 }}>
            <Input
              ref={this.lastNameRef}
              onChangeText={this.updateLastName}
              value={lastName}
              returnKeyType="next"
              placeholder={
                isMe
                  ? t('profileLabels.lastName')
                  : t('profileLabels.lastNameOptional')
              }
              placeholderTextColor="white"
              blurOnSubmit={true}
            />
          </View>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.save}
            text={t('next').toUpperCase()}
          />
        </Flex>
        <BackButton absolute={true} />
      </View>
    );
  }
}

SetupScreen.propTypes = {
  next: PropTypes.func.isRequired,
  isMe: PropTypes.bool,
};

const mapStateToProps = ({ auth }, { navigation }) => {
  const { isMe } = navigation.state.params || {};

  return {
    isMe,
    me: auth.person,
  };
};

export default connect(mapStateToProps)(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
