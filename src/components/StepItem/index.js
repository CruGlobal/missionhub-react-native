import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../common';
import theme from '../../theme';
import ItemHeaderText from '../ItemHeaderText';

import styles from './styles';

function getAnimation(isHiding, isInitialMount) {
  return isHiding ? (isInitialMount ? '' : 'fadeOutRight') : 'fadeInRight';
}

@withTranslation()
class StepItem extends Component {
  state = {
    hovering: false,
    animation: getAnimation(this.props.hideAction, true),
  };

  componentDidUpdate(prevProps) {
    const { hideAction } = this.props;
    if (prevProps.hideAction !== hideAction) {
      this.setState({ animation: getAnimation(hideAction) });
    }
  }

  onHover = () => this.setState({ hovering: true });
  onBlur = () => this.setState({ hovering: false });
  handleAction = () => {
    const { onAction, step } = this.props;
    onAction && onAction(step);
  };
  handleSelect = () => {
    const { step, onSelect } = this.props;
    if (!step.receiver) {
      return;
    } else {
      onSelect && onSelect(step);
    }
  };

  renderIcon() {
    const { type, onAction } = this.props;
    const { hovering, animation } = this.state;

    // Don't show on the initial render if `hideAction` is true or there is no `onAction`
    if (!onAction || !animation) {
      return null;
    }

    let iconName = 'starIcon';
    if (hovering || type === 'reminder') {
      iconName = 'starIconFilled';
    }
    return (
      <Touchable
        onPress={this.handleAction}
        onPressIn={this.onHover}
        onPressOut={this.onBlur}
      >
        <Flex align="center" justify="center" animation={animation}>
          <Icon
            name={iconName}
            type="MissionHub"
            style={[
              styles.icon,
              type === 'reminder' ? styles.iconReminder : undefined,
            ]}
          />
        </Flex>
      </Touchable>
    );
  }

  render() {
    const { step, type, myId, t } = this.props;
    const isMe = step.receiver && step.receiver.id === myId;
    let ownerName = isMe
      ? t('me')
      : step.receiver
      ? step.receiver.full_name
      : '';
    ownerName = (ownerName || '').toUpperCase();
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
        <Flex align="center" direction="row" style={styles.row}>
          <Flex value={1} justify="center" direction="column">
            {type === 'contact' ? null : <ItemHeaderText text={ownerName} />}
            <Text style={styles.description}>{step.title}</Text>
          </Flex>
          {this.renderIcon()}
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
    receiver: PropTypes.object,
  }).isRequired,
  onSelect: PropTypes.func,
  onAction: PropTypes.func,
  hideAction: PropTypes.bool,
  type: PropTypes.oneOf(['swipeable', 'contact', 'reminder']),
};

const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});

export default connect(mapStateToProps)(StepItem);
