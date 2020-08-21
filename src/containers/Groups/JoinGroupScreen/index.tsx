import React, { Component } from 'react';
import {
  ScrollView,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, Input } from '../../../components/common';
import GroupCardItem from '../../../components/GroupCardItem';
import Header from '../../../components/Header';
import theme from '../../../theme';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { lookupOrgCommunityCode } from '../../../actions/organizations';
import CloseButton from '../../../components/CloseButton';
import Analytics from '../../Analytics';

import styles from './styles';

// @ts-ignore
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
      // @ts-ignore
      () => this.codeInput && this.codeInput.focus && this.codeInput.focus(),
      350,
    );
  }

  // @ts-ignore
  onChangeCode = code => {
    this.setState({ code: code.toUpperCase() }, () => {
      if (code.length >= 6) {
        this.onSearch();
      }
    });
  };

  onSearch = async () => {
    const {
      // @ts-ignore
      codeInput,
      state: { code },
      // @ts-ignore
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
    // @ts-ignore
    const { dispatch, next } = this.props;
    const { community } = this.state;
    Keyboard.dismiss();

    dispatch(
      next({
        community,
      }),
    );
  };

  // @ts-ignore
  ref = c => (this.codeInput = c);

  renderStart() {
    // @ts-ignore
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        {/* 
        // @ts-ignore */}
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
      // @ts-ignore
      id,
      // @ts-ignore
      name,
      // @ts-ignore
      owner,
      // @ts-ignore
      contactReport = {},
      // @ts-ignore
      community_photo_url,
      // @ts-ignore
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
      communityPhotoUrl: community_photo_url,
      unreadCommentsCount: unread_comments_count,
    };

    // @ts-ignore
    return <GroupCardItem group={group} onJoin={this.navigateNext} />;
  }

  render() {
    // @ts-ignore
    const { t } = this.props;
    const { code, errorMessage, community } = this.state;

    return (
      <View style={styles.container}>
        <Analytics screenName={['communities', 'enter code']} />
        <Header left={<CloseButton />} title={t('joinCommunity')} />
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

// @ts-ignore
JoinGroupScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(JoinGroupScreen);
export const JOIN_GROUP_SCREEN = 'nav/JOIN_GROUP_SCREEN';
