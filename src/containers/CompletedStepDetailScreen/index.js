import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Text } from '../../components/common';
import StepDetailScreen from '../../components/StepDetailScreen';
import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';

import styles from './styles';

@withTranslation('completedStepDetail')
class CompletedStepDetailScreen extends Component {
  render() {
    const { t, step } = this.props;
    const { challenge_suggestion, completed_at } = step;
    const { reminderButton, completedText, completedIcon } = styles;

    return (
      <StepDetailScreen
        CenterHeader={<Text>{t('completedStep')}</Text>}
        RightHeader={null}
        CenterContent={
          <View style={reminderButton}>
            <View
              flex={1}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text style={completedText}>
                {t('completedOn', {
                  date: moment(completed_at).format('dddd, MMMM D YYYY'),
                })}
              </Text>
              <Image source={GREY_CHECKBOX} style={completedIcon} />
            </View>
          </View>
        }
        markdown={
          challenge_suggestion && challenge_suggestion.description_markdown
        }
        text={step.title}
        bottomButtonProps={null}
      />
    );
  }
}

CompletedStepDetailScreen.propTypes = { step: PropTypes.object.isRequired };

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step },
      },
    },
  },
) => ({
  step,
});
export default connect(mapStateToProps)(CompletedStepDetailScreen);
export const COMPLETED_STEP_DETAIL_SCREEN = 'nav/COMPLETED_STEP_DETAIL_SCREEN';
