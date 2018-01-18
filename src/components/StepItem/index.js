import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Flex, Text, Touchable, Icon } from '../common';
import styles from './styles';

class StepItem extends Component {
  setNativeProps(nProps) { this._view.setNativeProps(nProps); }
  handleAction = () => { this.props.onAction && this.props.onAction(this.props.step); }
  handleSelect = () => { this.props.onSelect && this.props.onSelect(this.props.step); }

  render() {
    const { step, type, myId, onAction } = this.props;
    const isMe = step.receiver && step.receiver.id === myId ;
    let ownerName = isMe ? 'Me' : step.receiver.full_name || '';
    ownerName = ownerName.toUpperCase();
    return (
      <Touchable
        activeOpacity={1}
        highlight={type !== 'reminder'}
        onPress={this.handleSelect}>
        <Flex
          ref={(c) => this._view = c}
          align="center"
          direction="row"
          style={[
            styles.row,
            type && styles[type] ? styles[type] : null,
          ]}
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
                <Icon name="searchIcon" type="MissionHub" style={styles.icon} />
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
  type: PropTypes.oneOf(['swipeable', 'contact', 'reminder']),
};

const mapStateToProps = ({ auth }) => ({
  myId: auth.personId,
});

export default connect(mapStateToProps)(StepItem);