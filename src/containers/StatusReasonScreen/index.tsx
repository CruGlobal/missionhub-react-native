import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { navigateBack } from '../../actions/navigation';
import { deleteContactAssignment } from '../../actions/person';
import { Flex, Text, Button, Input } from '../../components/common';
import Header from '../../components/Header';
import DeprecatedBackButton from '../DeprecatedBackButton';
import theme from '../../theme';

import styles from './styles';

// @ts-ignore
@withTranslation('statusReason')
class StatusReasonScreen extends Component {
  state = { text: '' };

  // @ts-ignore
  handleChangeText = t => {
    this.setState({ text: t });
  };

  submit = () => {
    const {
      // @ts-ignore
      dispatch,
      // @ts-ignore
      contactAssignment,
      // @ts-ignore
      person,
      // @ts-ignore
      organization,
      // @ts-ignore
      onSubmit,
    } = this.props;
    const { text } = this.state;

    dispatch(
      deleteContactAssignment(
        contactAssignment.id,
        person.id,
        organization.id,
        text,
      ),
    );
    onSubmit ? onSubmit() : dispatch(navigateBack());
  };

  render() {
    // @ts-ignore
    const { t, organization } = this.props;

    return (
      <View style={styles.container}>
        <Header
          left={<DeprecatedBackButton />}
          right={
            <Button
              text={t('done').toUpperCase()}
              type="transparent"
              onPress={this.submit}
              style={styles.headerButton}
              buttonTextStyle={styles.headerButtonText}
            />
          }
        />
        <Flex value={1} align="stretch" style={styles.content}>
          <Text style={styles.text}>
            {t('important', { organization: organization.name })}
          </Text>
          <Input
            onChangeText={this.handleChangeText}
            placeholder={t('placeholder')}
            placeholderTextColor={theme.white}
            value={this.state.text}
            style={styles.input}
            blurOnSubmit={true}
            autoCorrect={true}
          />
        </Flex>
      </View>
    );
  }
}

// @ts-ignore
StatusReasonScreen.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  contactAssignment: PropTypes.object.isRequired,
};

// @ts-ignore
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.person,
});

export default connect(mapStateToProps)(StatusReasonScreen);
export const STATUS_REASON_SCREEN = 'nav/STATUS_REASON';
