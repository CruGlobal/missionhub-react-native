import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { INTERACTION_TYPES } from '../../constants';
import { addNewInteraction } from '../../actions/interactions';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { navigatePush } from '../../actions/navigation';
import { Flex, Icon, Text, Touchable } from '../../components/common';
import styles from './styles';
import { reloadJourney } from '../../actions/journey';

const ACTION_ITEMS = Object.values(INTERACTION_TYPES).filter((i) => i.isOnAction);

@translate('actions')
export class ContactActions extends Component {

  handleInteraction = async(item, text) => {
    const { dispatch, person, organization } = this.props;
    await dispatch(addNewInteraction(person.id, item, text, organization && organization.id));
    dispatch(reloadJourney(person.id, organization.id));
  };

  handleCreateInteraction = (item) => {
    this.props.dispatch(navigatePush(ADD_STEP_SCREEN, {
      onComplete: (text) => this.handleInteraction(item, text),
      type: 'interaction',
      hideSkip: item.id === INTERACTION_TYPES.MHInteractionTypeNote.id,
    }));
  };

  renderIcons = (item) => {
    const { t } = this.props;

    return (
      <Flex key={item.id} direction="column" align="center" justify="start" style={styles.rowWrap}>
        <Touchable onPress={()=> this.handleCreateInteraction(item)} style={styles.iconBtn}>
          <Flex self="stretch" align="center" justify="center" style={styles.iconWrap}>
            <Icon name={item.iconName} type="MissionHub" style={[ styles.icon, item.iconName === 'commentIcon' ? styles.commentIcon : {} ]} />
          </Flex>
        </Touchable>
        <Text style={styles.text}>{t(item.translationKey)}</Text>
      </Flex>
    );
  }

  render() {
    return (
      <Flex direction="row" wrap="wrap" align="center" justify="center" style={styles.container}>
        <Flex direction="row" wrap="wrap" align="start" justify="center" >
          {
            ACTION_ITEMS.map(this.renderIcons)
          }
        </Flex>
      </Flex>
    );
  }
}

export default connect()(ContactActions);
