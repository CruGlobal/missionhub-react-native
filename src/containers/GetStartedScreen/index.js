import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { navigatePush } from '../../actions/navigation';
import { Flex, Text, Button } from '../../components/common';
import theme from '../../theme';
import { STAGE_ONBOARDING_SCREEN } from '../StageScreen';
import { disableBack } from '../../utils/common';

import styles from './styles';

@translate('getStarted')
class GetStartedScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  navigateNext = () => {
    disableBack.remove();
    this.props.dispatch(navigatePush(STAGE_ONBOARDING_SCREEN, {
      section: 'onboarding',
      subsection: 'self',
      enableBackButton: false,
    }));
  }

  render() {
    const { t, firstName } = this.props;
    const name = firstName.toLowerCase();

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex align="start" justify="center" value={4} >
          <Text type="header" style={styles.headerTitle}>{t('hi', { name })}</Text>
          <Text style={styles.text}>{t('tagline')}</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.navigateNext}
            text={t('getStarted').toUpperCase()}
            style={{ width: theme.fullWidth }}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ profile }, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
