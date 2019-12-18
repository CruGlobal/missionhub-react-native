import React, { Component } from 'react';
import {
  ScrollView,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, Text, Input } from '../../../components/common';
import GroupCardItem from '../../../components/GroupCardItem';
import Header from '../../../components/Header';
import theme from '../../../theme';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { lookupOrgCommunityCode } from '../../../actions/organizations';
import BackButton from '../../../containers/BackButton';

import styles from './styles';

@withTranslation('groupsJoinGroup')
class JoinGroupScreen extends Component {
  state = {
    code: '',
    errorMessage: '',
    community: undefined,
  };

  componentDidMount() {
    // Pause before focus so that the other screen can disappear before the keyboard comes up
    setTimeout(
      () => this.codeInput && this.codeInput.focus && this.codeInput.focus(),
      350,
    );
  }

  onChangeCode = code => {
    this.setState({ code: code.toUpperCase() }, () => {
      if (code.length >= 6) {
        this.onSearch();
      }
    });
  };

  onSearch = async () => {
    const {
      codeInput,
      state: { code },
      props: { t, dispatch },
    } = this;

    codeInput.focus();

    const errorState = {
      errorMessage: t('communityNotFound'),
      community: undefined,
    };

    const text = (code || '').trim();
    if (!text || text.length < 6) {
      this.setState(errorState);
      return;
    }

    try {
      const community = await dispatch(lookupOrgCommunityCode(text));

      if (!community) {
        this.setState(errorState);
        return;
      }
      this.setState({ errorMessage: '', community });
    } catch (e) {
      this.setState(errorState);
    }
  };

  navigateNext = () => {
    const { dispatch, next } = this.props;
    const { community } = this.state;
    Keyboard.dismiss();

    dispatch(
      next({
        community,
      }),
    );
  };

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

    const {
      id,
      name,
      owner,
      contactReport = {},
      user_created,
      community_photo_url,
      unread_comments_count,
    } = community;

    const group = {
      id,
      name,
      owner: {
        nodes: owner
          ? [
              {
                firstName: owner.first_name,
                lastName: owner.last_name,
              },
            ]
          : [],
      },
      report: {
        contactCount: contactReport.contactsCount || 0,
        unassignedCount: contactReport.unassignedCount || 0,
        memberCount: contactReport.memberCount || 0,
      },
      userCreated: user_created,
      communityPhotoUrl: community_photo_url,
      unreadCommentsCount: unread_comments_count,
    };

    return <GroupCardItem group={group} onJoin={this.navigateNext} />;
  }

  render() {
    const { t } = this.props;
    const { code, errorMessage, community } = this.state;

    return (
      <View style={styles.container}>
        <Header
          left={<BackButton customIcon="deleteIcon" />}
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
              selectionColor={theme.white}
              maxLength={6}
              value={code}
              autoFocus={false}
              blurOnSubmit={false}
              testID="joinInput"
            />
          </Flex>
          <KeyboardAvoidingView
            keyboardVerticalOffset={theme.buttonHeight}
            style={styles.flex}
          />
        </ScrollView>
      </View>
    );
  }
}

JoinGroupScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(JoinGroupScreen);
export const JOIN_GROUP_SCREEN = 'nav/JOIN_GROUP_SCREEN';
