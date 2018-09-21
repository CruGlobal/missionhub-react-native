import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import {
  getPeopleInteractionsReport,
  getImpactSummary,
} from '../../actions/impact';
import { Flex, Text, Button, Icon } from '../../components/common';
import { INTERACTION_TYPES } from '../../constants';
import {
  impactInteractionsSelector,
  impactSummarySelector,
} from '../../selectors/impact';

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
    const {
      dispatch,
      person = {},
      organization = {},
      isPersonalMinistryMe,
    } = this.props;

    // We don't scope summary sentence by org unless we are only scoping by org (person is not specified)
    // The summary sentence should include what the user has done in all of their orgs
    dispatch(
      getImpactSummary(person.id, person.id ? undefined : organization.id),
    );
    if (isPersonalMinistryMe) {
      dispatch(getImpactSummary()); // Get global impact by calling without person or org
    } else {
      this.getInteractionReport();
    }
  }

  getInteractionReport() {
    const { dispatch, person = {}, organization = {} } = this.props;

    dispatch(
      getPeopleInteractionsReport(
        person.id,
        organization.id,
        this.state.period,
      ),
    );
  }

  handleChangePeriod = period => {
    this.setState({ period }, () => {
      this.getInteractionReport();
    });
  };

  buildImpactSentence(
    {
      steps_count = 0,
      receivers_count = 0,
      step_owners_count = 0,
      pathway_moved_count = 0,
    },
    global = false,
  ) {
    const { t, person = {}, organization = {}, isMe } = this.props;
    const initiator = global
      ? '$t(users)'
      : isMe
        ? '$t(you)'
        : person.id
          ? person.first_name
          : '$t(we)';
    const context = count =>
      count === 0 ? (global ? 'emptyGlobal' : 'empty') : '';
    const isSpecificContact = !global && !isMe && person.id;

    const stepsSentenceOptions = {
      context: context(steps_count),
      year: new Date().getFullYear(),
      numInitiators: global ? step_owners_count : '',
      initiator: initiator,
      initiatorSuffix: !isSpecificContact ? '$t(haveSuffix)' : '$t(hasSuffix)',
      stepsCount: steps_count,
      receiversCount: receivers_count,
      scope: isSpecificContact
        ? '$t(inTheirLife)'
        : !global && !person.id && organization.name
          ? t('atOrgName', { orgName: organization.name })
          : '',
    };

    const stageSentenceOptions = {
      context: context(pathway_moved_count),
      initiator:
        initiator === '$t(users)' || initiator === '$t(we)'
          ? '$t(allOfUs)'
          : initiator,
      pathwayMovedCount: pathway_moved_count,
    };

    return `${t('stepsSentence', stepsSentenceOptions)}\n\n${t(
      'stageSentence',
      stageSentenceOptions,
    )}`;
  }

  renderContactReport() {
    const { t, interactions } = this.props;

    const interactionsReport =
      interactions[this.state.period] ||
      Object.values(INTERACTION_TYPES).filter(type => !type.hideReport);

    return (
      <Flex style={styles.interactionsWrap} direction="column">
        <Flex
          style={{ paddingBottom: 30 }}
          align="center"
          justify="center"
          direction="row"
        >
          {reportPeriods.map(p => {
            return (
              <Button
                key={p.id}
                text={p.text}
                pressProps={[p.period]}
                onPress={this.handleChangePeriod}
                style={
                  this.state.period === p.period
                    ? styles.activeButton
                    : styles.periodButton
                }
                buttonTextStyle={styles.buttonText}
              />
            );
          })}
        </Flex>
        {interactionsReport.map(i => {
          return (
            <Flex
              align="center"
              style={styles.interactionRow}
              key={i.id}
              direction="row"
            >
              <Flex value={1}>
                <Icon type="MissionHub" style={styles.icon} name={i.iconName} />
              </Flex>
              <Flex value={4}>
                <Text style={styles.interactionText}>
                  {t(i.translationKey)}
                </Text>
              </Flex>
              <Flex value={1} justify="center" align="end">
                <Text style={styles.interactionNumber}>{i.num || '-'}</Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    );
  }

  render() {
    const { globalImpact, impact, isPersonalMinistryMe, isCohort } = this.props;
    return (
      <ScrollView style={{ flex: 1 }} bounces={false}>
        <Flex style={styles.topSection}>
          <Text style={[styles.text, styles.topText]}>
            {this.buildImpactSentence(impact)}
          </Text>
        </Flex>
        <Image
          style={styles.image}
          source={require('../../../assets/images/impactBackground.png')}
        />
        {isPersonalMinistryMe || !isCohort ? (
          <Flex
            style={
              isPersonalMinistryMe
                ? styles.bottomSection
                : styles.interactionSection
            }
          >
            {isPersonalMinistryMe ? (
              <Text style={[styles.text, styles.bottomText]}>
                {this.buildImpactSentence(globalImpact, true)}
              </Text>
            ) : (
              this.renderContactReport()
            )}
          </Flex>
        ) : null}
      </ScrollView>
    );
  }
}

ImpactView.propTypes = {
  person: PropTypes.object,
  organization: PropTypes.object,
};

export const mapStateToProps = (
  { impact, auth },
  { person = {}, organization },
) => {
  const isMe = person.id === auth.person.id;

  return {
    isMe,
    isPersonalMinistryMe:
      isMe && (!organization || (organization && !organization.id)),
    isCohort: organization.user_created,
    // Impact summary isn't scoped by org unless showing org summary. See above comment
    impact: impactSummarySelector(
      { impact },
      { person, organization: person.id ? undefined : organization },
    ),
    interactions: impactInteractionsSelector(
      { impact },
      { person, organization },
    ),
    globalImpact: impactSummarySelector({ impact }),
  };
};

export default connect(mapStateToProps)(ImpactView);
