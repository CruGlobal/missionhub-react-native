import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getGlobalImpact, getPeopleInteractionsReport, getImpactById } from '../../actions/impact';
import { Flex, Text, Button, Icon } from '../../components/common';
import { INTERACTION_TYPES } from '../../constants';

import styles from './styles';

const reportPeriods = [
  {
    id: 1,
    text: '1w',
    period: 'P1W',
  },
  {
    id: 2,
    text: '1m',
    period: 'P1M',
  },
  {
    id: 3,
    text: '3m',
    period: 'P3M',
  },
  {
    id: 4,
    text: '6m',
    period: 'P6M',
  },
  {
    id: 5,
    text: '1y',
    period: 'P1Y',
  },
];

@translate('impact')
export class ImpactView extends Component {
  state = {
    period: 'P1W',
  };

  componentDidMount() {
    const { dispatch, personId, isContactScreen } = this.props;

    dispatch(getImpactById(personId));
    if (isContactScreen) {
      this.getInteractionReport();
    } else {
      dispatch(getGlobalImpact());
    }
  }

  getInteractionReport() {
    const { dispatch, person, organization = {} } = this.props;

    dispatch(getPeopleInteractionsReport(person.id, organization.id, this.state.period));
  }

  handleChangePeriod(period) {
    this.setState({ period }, () => {
      this.getInteractionReport();
    });
  }

  buildImpactSentence({ steps_count = 0, receivers_count = 0, step_owners_count = 0, pathway_moved_count = 0 }, global = false) {
    const { t, isContactScreen, person } = this.props;
    const initiator = global ? '$t(users)' : isContactScreen ? person.first_name : '$t(you)';
    const context = (count) => count === 0 ? global ? 'emptyGlobal' : isContactScreen ? 'emptyContact' : 'empty' : '';

    const stepsSentenceOptions = {
      context: context(steps_count),
      year: new Date().getFullYear(),
      numInitiators: global ? step_owners_count : '',
      initiator: initiator,
      stepsCount: steps_count,
      receiversCount: receivers_count,
    };

    const stageSentenceOptions = {
      context: context(pathway_moved_count),
      initiator: initiator,
      pathwayMovedCount: pathway_moved_count,
    };

    return `${t('stepsSentence', stepsSentenceOptions)}\n\n${t('stageSentence', stageSentenceOptions)}`;
  }

  renderContactReport() {
    const { t, interactions } = this.props;

    const interactionsReport =
      interactions[this.state.period] ||
      Object.values(INTERACTION_TYPES)
        .filter((type) => !type.hideReport);

    return (
      <Flex style={styles.interactionsWrap} direction="column">
        <Flex style={{ paddingBottom: 30 }} align="center" justify="center" direction="row">
          {
            reportPeriods.map((p) => {
              return (
                <Button
                  key={p.id}
                  text={p.text}
                  onPress={() => this.handleChangePeriod(p.period)}
                  style={this.state.period === p.period ? styles.activeButton : styles.periodButton}
                  buttonTextStyle={styles.buttonText}
                />
              );
            })
          }
        </Flex>
        {
          interactionsReport.map((i) => {
            return (
              <Flex align="center" style={styles.interactionRow} key={i.id} direction="row">
                <Flex value={1}>
                  <Icon type="MissionHub" style={styles.icon} name={i.iconName} />
                </Flex>
                <Flex value={4}>
                  <Text style={styles.interactionText}>{t(i.translationKey)}</Text>
                </Flex>
                <Flex value={1} justify="center" align="end">
                  <Text style={styles.interactionNumber}>{i.num || '-'}</Text>
                </Flex>
              </Flex>
            );
          })
        }
      </Flex>
    );
  }

  render() {
    const { globalImpact, impact, isContactScreen } = this.props;
    return (
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
      >
        <Flex style={styles.topSection}>
          <Text style={[ styles.text, styles.topText ]}>
            {this.buildImpactSentence(impact)}
          </Text>
        </Flex>
        <Image style={styles.image} source={require('../../../assets/images/impactBackground.png')} />
        <Flex style={isContactScreen ? styles.interactionSection : styles.bottomSection}>
          {
            isContactScreen ?
              this.renderContactReport() :
              <Text style={[ styles.text, styles.bottomText ]}>
                {this.buildImpactSentence(globalImpact, true)}
              </Text>
          }
        </Flex>
      </ScrollView>
    );
  }
}

ImpactView.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object,
};

export const mapStateToProps = ({ impact, auth }, { person, organization = {} }) => {
  const isContactScreen = person.id !== auth.person.id;
  const personId = person.id;
  const orgId = organization.id || '';

  return {
    isContactScreen,
    personId,
    impact: impact.people[personId] || {},
    interactions: impact.interactions[`${personId}-${orgId}`] || {},
    globalImpact: impact.global,
  };
};

export default connect(mapStateToProps)(ImpactView);
