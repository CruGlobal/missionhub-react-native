import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getGlobalImpact, getMyImpact, getUserImpact, getImpactById } from '../../actions/impact';

import styles from './styles';
import { Flex, Text, Button, Icon } from '../../components/common';
import { INTERACTION_TYPES } from '../../constants';

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

  constructor(props) {
    super(props);

    this.state = {
      contactImpact: {},
      interactionReport: {},
      interactions: [],
      period: 'P1W',
    };
  }

  componentWillMount() {
    if (this.props.isContactScreen) {
      this.props.dispatch(getImpactById(this.props.user.id)).then((results) => {
        this.setState({ contactImpact: results.findAll('impact_report')[0] || {} });
      });
      this.getInteractionReport();
    } else {
      this.props.dispatch(getGlobalImpact());
      this.props.dispatch(getMyImpact());
      this.getInteractionReport(this.buildCurrentYearPeriod());
    }

  }

  buildCurrentYearPeriod = function() {
    var today = new Date();
    var months = today.getMonth();
    var days = today.getDate();

    return 'P' + months + 'M' + days + 'D';
  };

  async getInteractionReport(period = this.state.period) {
    const { dispatch, user, me, organization = {} } = this.props;

    const { response: personReports } = await dispatch(getUserImpact(user ? user.id : me.id, organization.id, period));

    const report = personReports[0];
    const interactions = report ? report.interactions : [];
    const arr = Object.keys(INTERACTION_TYPES).filter((k) => !INTERACTION_TYPES[k].hideReport).map((key) => {
      let num = 0;
      if (INTERACTION_TYPES[key].requestFieldName) {
        num = report ? report[INTERACTION_TYPES[key].requestFieldName] : 0;
      } else {
        const interaction = interactions.find((i) => i.interaction_type_id === INTERACTION_TYPES[key].id);
        num = interaction ? interaction.interaction_count : 0;
      }
      return {
        ...INTERACTION_TYPES[key],
        num,
      };
    });
    this.setState({ interactionReport: report, interactions: arr });
  }

  handleChangePeriod(period) {
    this.setState({ period }, () => {
      this.getInteractionReport();
    });
  }

  buildImpactSentence({ steps_count = 0, receivers_count = 0, step_owners_count = 0, pathway_moved_count = 0 }, global = false) {
    const { t, isContactScreen, user } = this.props;
    const initiator = global ? '$t(users)' : isContactScreen ? user.first_name : '$t(you)';
    const context = (count) => count === 0 ? global ? 'emptyGlobal' : isContactScreen ? 'emptyContact' : 'empty' : '';
    const { contacts_with_interaction_count = 0 } = this.state.interactionReport || {};

    let numInteractions = 0;

    // ignore: num uncontacted, num assigned contacts and notes
    const ignoredReportValues = [ 100, 101, 1 ];
    this.state.interactions.forEach(function(interaction) {
      if (!ignoredReportValues.includes(interaction.id)) {
        numInteractions += interaction.num;
      }
    });

    const stepsSentenceOptions = {
      context: context(steps_count + (global ? 0 : numInteractions)),
      year: new Date().getFullYear(),
      numInitiators: global ? step_owners_count : '',
      initiator: initiator,
      stepsCount: steps_count + (global ? 0 : numInteractions),
      receiversCount: receivers_count + (global ? 0 : contacts_with_interaction_count),
    };

    const stageSentenceOptions = {
      context: context(pathway_moved_count),
      initiator: initiator,
      pathwayMovedCount: pathway_moved_count,
    };

    return `${t('stepsSentence', stepsSentenceOptions)}\n\n${t('stageSentence', stageSentenceOptions)}`;
  }

  renderContactReport() {
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
          this.state.interactions.map((i) => {
            return (
              <Flex align="center" style={styles.interactionRow} key={i.id} direction="row">
                <Flex value={1}>
                  <Icon type="MissionHub" style={styles.icon} name={i.iconName} />
                </Flex>
                <Flex value={4}>
                  <Text style={styles.interactionText}>{this.props.t(i.translationKey)}</Text>
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
    const { globalImpact, userImpact, isContactScreen } = this.props;
    const { contactImpact } = this.state;
    return (
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
      >
        <Flex style={styles.topSection}>
          <Text style={[ styles.text, styles.topText ]}>
            {this.buildImpactSentence(isContactScreen ? contactImpact : userImpact)}
          </Text>
        </Flex>
        <Image style={styles.image} source={require('../../../assets/images/impactBackground.png')} />
        <Flex style={isContactScreen ? styles.interactionSection : styles.bottomSection}>
          {
            isContactScreen ? this.renderContactReport() : (
              <Text style={[ styles.text, styles.bottomText ]}>
                {this.buildImpactSentence(globalImpact, true)}
              </Text>
            )
          }
        </Flex>
      </ScrollView>
    );
  }
}

ImpactView.propTypes = {
  isContactScreen: PropTypes.bool,
  user: PropTypes.object,
};

export const mapStateToProps = ({ impact, auth }) => ({
  userImpact: impact.mine,
  globalImpact: impact.global,
  me: auth.user,
});

export default connect(mapStateToProps)(ImpactView);
