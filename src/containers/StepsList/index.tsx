import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { getStepSuggestions } from '../../actions/steps';
import { insertName } from '../../utils/steps';
import StepSuggestionItem from '../../components/StepSuggestionItem';
import LoadMore from '../../components/LoadMore';
import { keyExtractorId } from '../../utils/common';

import styles from './styles';

@withTranslation('selectStep')
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
    const { isMe, suggestions, contactName } = this.props;

    const newSuggestions = suggestions.slice(0, suggestionIndex);
    return isMe ? newSuggestions : insertName(newSuggestions, contactName);
  }

  renderItem = ({ item }) => {
    return <StepSuggestionItem step={item} onPress={this.props.onPressStep} />;
  };

  stepsListRef = c => (this.stepsList = c);

  render() {
    const { t, suggestions } = this.props;
    const { suggestionIndex } = this.state;
    const { list } = styles;

    return (
      <FlatList
        ref={this.stepsListRef}
        keyExtractor={keyExtractorId}
        data={this.getSuggestionSubset()}
        renderItem={this.renderItem}
        scrollEnabled={true}
        style={list}
        ListFooterComponent={
          suggestions.length > suggestionIndex && (
            <LoadMore
              onPress={this.handleLoadSteps}
              text={t('loadMoreSteps').toUpperCase()}
            />
          )
        }
      />
    );
  }
}

StepsList.propTypes = {
  contactName: PropTypes.string,
  contactStageId: PropTypes.string.isRequired,
  onPressStep: PropTypes.func.isRequired,
};

const mapStateToProps = (
  { auth, steps },
  { contactName, receiverId, contactStageId, onPressStep },
) => {
  const myId = auth.person.id;
  const isMe = receiverId === myId;

  return {
    contactName,
    contactStageId,
    onPressStep,
    isMe,
    suggestions:
      (isMe
        ? steps.suggestedForMe[contactStageId]
        : steps.suggestedForOthers[contactStageId]) || [],
  };
};
export default connect(mapStateToProps)(StepsList);
