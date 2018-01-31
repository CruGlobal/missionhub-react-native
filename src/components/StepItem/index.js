import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../common';
import styles from './styles';
import theme from '../../theme';

@translate()
class StepItem extends Component {
  setNativeProps(nProps) { this._view.setNativeProps(nProps); }
  handleAction = () => { this.props.onAction && this.props.onAction(this.props.step); }
  handleSelect = () => { this.props.onSelect && this.props.onSelect(this.props.step); }

  render() {
    const { step, type, myId, onAction, t } = this.props;
    const isMe = step.receiver && step.receiver.id === myId ;
    let ownerName = isMe ? t('me') : step.receiver.full_name || '';
    ownerName = ownerName.toUpperCase();
    return (
      <Touchable
        highlight={type !== 'reminder'}
        style={type && styles[type] ? styles[type] : undefined}
        onPress={this.handleSelect}
        activeOpacity={1}
        underlayColor={theme.convert({
          color: theme.secondaryColor,
          lighten: 0.5,
        })}
      >
        <Flex
          ref={(c) => this._view = c}
          align="center"
          direction="row"
          style={styles.row}
        >
          <Flex value={1} justify="center" direction="column">
            {
              type === 'contact' ? null : (
                <Text style={styles.person}>
                  {ownerName}
                </Text>
              )
            }
            <Text style={styles.description}>
              {step.title}
            </Text>
          </Flex>
          {
            onAction ? (
              <Touchable onPress={this.handleAction}>
                <Icon
                  name="starIcon"
                  type="MissionHub"
                  style={[
                    styles.icon,
                    type === 'reminder' ? styles.iconReminder : undefined,
                  ]} />
              </Touchable>
            ) : null
          }
        </Flex>
      </Touchable>
    );
  }

}

StepItem.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    accepted_at: PropTypes.date,
    completed_at: PropTypes.date,
    created_at: PropTypes.date,
    updated_at: PropTypes.date,
    notified_at: PropTypes.date,
    note: PropTypes.string,
    owner: PropTypes.object.isRequired,
    receiver: PropTypes.object.isRequired,
  }).isRequired,
  onSelect: PropTypes.func,
  onAction: PropTypes.func,
  type: PropTypes.oneOf([ 'swipeable', 'contact', 'reminder' ]),
};

const mapStateToProps = ({ auth }) => ({
  myId: auth.personId,
});

export default connect(mapStateToProps)(StepItem);
