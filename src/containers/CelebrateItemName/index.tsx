import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux-legacy';

import { Button } from '../../components/common';
import ItemHeaderText from '../../components/ItemHeaderText/index';
import { navToPersonScreen } from '../../actions/person';

// @ts-ignore
@withTranslation('celebrateFeeds')
class CelebrateItemName extends Component {
  onPressNameLink = () => {
    // @ts-ignore
    const { dispatch, person, organization } = this.props;

    dispatch(navToPersonScreen(person, organization));
  };

  render() {
    // @ts-ignore
    const { name, t, customContent, pressable } = this.props;
    const content = customContent || (
      <ItemHeaderText text={name || t('missionHubUser')} />
    );

    if (!name || !pressable) {
      return content;
    }

    return (
      <Button type="transparent" onPress={this.onPressNameLink}>
        {content}
      </Button>
    );
  }
}

// @ts-ignore
CelebrateItemName.propTypes = {
  name: PropTypes.string,
  person: PropTypes.object,
  organization: PropTypes.object,
  pressable: PropTypes.bool,
};

export default connect()(CelebrateItemName);
