import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { getStepSuggestions } from '../../actions/steps';
import { insertName } from '../../utils/steps';
import StepSuggestionItem from '../../components/StepSuggestionItem';
import LoadMore from '../../components/LoadMore';

import styles from './styles';

@translate('selectStep')
class StepsList extends Component {
  state = {
    suggestionIndex: 4,
  };

  componentDidMount() {
    const { dispatch, isMe, contactStageId } = this.props;

    dispatch(getStepSuggestions(isMe, contactStageId));
  }

  handleLoadSteps = () => {
    const { suggestionIndex } = this.state;

    this.setState({ suggestionIndex: suggestionIndex + 4 });
  };

  getSuggestionSubset() {
    const { suggestionIndex } = this.state;
    const { isMe, suggestions, contactName, personFirstName } = this.props;

    const newSuggestions = suggestions.slice(0, suggestionIndex);
    return isMe
      ? newSuggestions
      : insertName(newSuggestions, contactName || personFirstName);
  }

  renderItem = ({ item }) => {
    const { organization, receiverId } = this.props;

    return (
      <StepSuggestionItem
        step={item}
        receiverId={receiverId}
        orgId={organization && organization.id}
      />
    );
  };

  renderLoadMore = () => (
    <LoadMore
      onPress={this.handleLoadSteps}
      text={this.props.t('loadMoreSteps').toUpperCase()}
    />
  );

  stepsListRef = c => (this.stepsList = c);

  keyExtractor = item => item.id;

  render() {
    const { suggestions } = this.props;
    const { suggestionIndex } = this.state;
    const { list } = styles;

    return (
      <FlatList
        ref={this.stepsListRef}
        keyExtractor={this.keyExtractor}
        data={this.getSuggestionSubset()}
        renderItem={this.renderItem}
        scrollEnabled={true}
        style={list}
        ListFooterComponent={
          suggestions.length > suggestionIndex && this.renderLoadMore
        }
      />
    );
  }
}

StepsList.propTypes = {
  personFirstName: PropTypes.string,
  contactName: PropTypes.string,
  receiverId: PropTypes.string,
  organization: PropTypes.object,
  contactStageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  isMe: PropTypes.bool.isRequired, //todo don't pass this
};

const mapStateToProps = ({ auth, steps }, { isMe, contactStageId }) => ({
  myId: auth.person.id,
  suggestions: isMe
    ? steps.suggestedForMe[contactStageId]
    : steps.suggestedForOthers[contactStageId],
});

export default connect(mapStateToProps)(StepsList);
