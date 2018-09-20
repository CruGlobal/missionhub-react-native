import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Button } from '../common';
import { assignContactAndPickStage } from '../../actions/misc';

import styles from './styles';

@translate()
class AssignToMeButton extends Component {
  assignToMe = () => {
    const { dispatch, person, organization, myId } = this.props;
    dispatch(assignContactAndPickStage(person, organization, myId));
  };

  render() {
    const { t } = this.props;

    return (
      <Button
        type="transparent"
        onPress={this.assignToMe}
        text={t('assignToMe').toUpperCase()}
        style={styles.assignButton}
        buttonTextStyle={styles.assignButtonText}
      />
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});
export default connect(mapStateToProps)(AssignToMeButton);

AssignToMeButton.propTypes = {
  organization: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
};
