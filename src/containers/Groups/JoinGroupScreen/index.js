import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  Flex,
  Text,
  Input,
  IconButton,
  Button,
} from '../../../components/common';
import GroupCardItem from '../../../components/GroupCardItem';
import Header from '../../Header';
import theme from '../../../theme';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { navigateBack } from '../../../actions/navigation';

import styles from './styles';

@translate('groupsJoinGroup')
class JoinGroupScreen extends Component {
  state = {
    code: '',
    errorMessage: '',
    community: undefined,
  };

  onChangeCode = code => {
    this.setState({ code: code.toUpperCase() }, () => {
      if (code.length >= 6) {
        this.onSearch();
      }
    });
  };

  onSearch = () => {
    const {
      codeInput,
      state: { code },
      props: { t },
    } = this;

    codeInput.focus();

    const text = (code || '').trim();
    if (!text || text.length < 6) {
      this.setState({
        errorMessage: t('communityNotFound'),
        community: undefined,
      });
      return;
    }

    // TODO: search community by code
    this.setState({
      errorMessage: '',
      community: {
        name: 'Test Community',
        owner: 'Roge',
        contactReport: {
          membersCount: 17,
        },
      },
    });
  };

  joinCommunity = () => {
    Keyboard.dismiss();
    // TODO: join community
    /*dispatch(
      trackAction(ACTIONS.SELECT_COMMUNITY, {
        [ACTIONS.SELECT_COMMUNITY.JOIN]: null,
      }),
    );*/
  };

  navigateBack = () => this.props.dispatch(navigateBack());

  ref = c => (this.codeInput = c);

  renderStart() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Image resizeMode="contain" source={GROUP_ICON} style={styles.image} />
        <Text style={styles.text}>{t('enterCode')}</Text>
      </Flex>
    );
  }

  renderError() {
    const { errorMessage } = this.state;
    return (
      <Flex align="center" justify="center">
        <Text style={styles.text}>{errorMessage}</Text>
      </Flex>
    );
  }

  renderGroupCard() {
    const { community } = this.state;

    return <GroupCardItem group={community} onJoin={this.joinCommunity} />;
  }

  render() {
    const { t } = this.props;
    const { code, errorMessage, community } = this.state;

    return (
      <View style={styles.container}>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          shadow={false}
          title={t('joinCommunity')}
        />
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
          <Flex align="center" justify="end" style={styles.imageWrap}>
            {errorMessage
              ? this.renderError()
              : community
                ? this.renderGroupCard()
                : this.renderStart()}
          </Flex>
          <Flex style={styles.fieldWrap}>
            <Input
              ref={this.ref}
              style={styles.input}
              onChangeText={this.onChangeCode}
              maxLength={6}
              value={code}
              autoFocus={true}
              blurOnSubmit={false}
            />
          </Flex>
          <KeyboardAvoidingView
            keyboardVerticalOffset={theme.buttonHeight}
            style={styles.flex}
          />
        </ScrollView>

        <Flex align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.onSearch}
            text={t('search').toUpperCase()}
            style={styles.searchButton}
          />
        </Flex>
      </View>
    );
  }
}

JoinGroupScreen.propTypes = {};

export default connect()(JoinGroupScreen);
export const JOIN_GROUP_SCREEN = 'nav/JOIN_GROUP_SCREEN';
