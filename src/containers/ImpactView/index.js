/* eslint complexity: 0, max-lines: 0 */

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
import { INTERACTION_TYPES, GLOBAL_COMMUNITY_ID } from '../../constants';
import {
  impactInteractionsSelector,
  impactSummarySelector,
} from '../../selectors/impact';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../Groups/OnboardingCard';
import { orgIsPersonalMinistry } from '../../utils/common';

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
      isUserCreatedOrg,
      myId,
      isGlobalCommunity,
    } = this.props;

    // We don't scope summary sentence by org unless we are only scoping by org (person is not specified)
    // The summary sentence should include what the user has done in all of their orgs
    dispatch(
      getImpactSummary(
        isGlobalCommunity ? myId : person.id,
        person.id || isGlobalCommunity ? undefined : organization.id,
      ),
    );
    if (isPersonalMinistryMe || isUserCreatedOrg) {
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
    paramGlobal = false,
  ) {
    const {
      t,
      person = {},
      isMe,
      isUserCreatedOrg,
      isGlobalCommunity,
    } = this.props;
    const init = paramGlobal
      ? '$t(users)'
      : isMe || isGlobalCommunity
        ? '$t(you)'
        : person.id
          ? person.first_name
          : steps_count === 0
            ? '$t(we)'
            : '$t(togetherWe)';
    const context = c =>
      c === 0 ? (paramGlobal ? 'emptyGlobal' : 'empty') : '';
    const isSpecificContact =
      !paramGlobal && !isMe && !isGlobalCommunity && person.id;
    const hideStageSentence =
      !paramGlobal && isUserCreatedOrg && pathway_moved_count === 0;
    const year = new Date().getFullYear();

    const stepsSentenceOptions = {
      context: context(steps_count),
      numInitiators: paramGlobal ? `${step_owners_count} ` : '',
      initiator: init,
      initiatorSuffix: !isSpecificContact ? t('haveSuffix') : t('hasSuffix'),
      stepsCount: steps_count,
      receiversCount: receivers_count,
      beginningScope:
        init === '$t(togetherWe)' ? '' : `${t('inYear', { year })}, `,
      endingScope: isSpecificContact
        ? t('inTheirLife')
        : init !== '$t(togetherWe)'
          ? ''
          : ` ${t('inYear', { year })}`,
    };
    const stageSentenceOptions = {
      context: context(pathway_moved_count),
      initiator:
        init === '$t(users)' || init === '$t(we)' || init === '$t(togetherWe)'
          ? '$t(allOfUs)'
          : init,
      pathwayMovedCount: pathway_moved_count,
    };

    const stepsStr = t('stepsSentence', stepsSentenceOptions);
    return `${stepsStr[0].toUpperCase() + stepsStr.slice(1)}${
      hideStageSentence ? '' : `\n\n${t('stageSentence', stageSentenceOptions)}`
    }`;
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
    const {
      globalImpact,
      impact,
      isPersonalMinistryMe,
      isUserCreatedOrg,
      isOrgImpact,
      organization,
      isGlobalCommunity,
    } = this.props;

    const showGlobalImpact =
      isPersonalMinistryMe ||
      (isUserCreatedOrg && isOrgImpact) ||
      isGlobalCommunity;
    const showInteractionReport = !isPersonalMinistryMe && !isUserCreatedOrg;

    return (
      <ScrollView style={styles.container} bounces={false}>
        {organization ? (
          <OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />
        ) : null}
        <Flex style={styles.topSection}>
          <Text style={[styles.text, styles.topText]}>
            {this.buildImpactSentence(impact)}
          </Text>
        </Flex>
        <Image
          style={styles.image}
          source={require('../../../assets/images/impactBackground.png')}
        />
        <Flex
          style={
            showGlobalImpact ? styles.bottomSection : styles.interactionSection
          }
        >
          {showGlobalImpact ? (
            <Text style={[styles.text, styles.bottomText]}>
              {this.buildImpactSentence(globalImpact, true)}
            </Text>
          ) : showInteractionReport ? (
            this.renderContactReport()
          ) : null}
        </Flex>
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
  { person = {}, organization = {} },
) => {
  const orgId = organization.id || 'personal';
  const personId = person.id;
  const myId = auth.person.id;
  const isMe = personId === myId;
  const isGlobalCommunity = orgId === GLOBAL_COMMUNITY_ID;

  return {
    isMe,
    isPersonalMinistryMe: isMe && orgIsPersonalMinistry(organization),
    isOrgImpact: !personId,
    isUserCreatedOrg: organization.user_created,
    // Impact summary isn't scoped by org unless showing org summary. See above comment
    impact: impactSummarySelector(
      { impact },
      {
        person: isGlobalCommunity ? { id: myId } : person,
        organization: personId || isGlobalCommunity ? undefined : organization,
      },
    ),
    interactions: impactInteractionsSelector(
      { impact },
      { person, organization },
    ),
    globalImpact: impactSummarySelector({ impact }),
    isGlobalCommunity,
    myId,
  };
};

export default connect(mapStateToProps)(ImpactView);
