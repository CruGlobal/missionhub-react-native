/* eslint complexity:0 */

import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Icon, DateComponent } from '../common';
import { INTERACTION_TYPES, ACCEPTED_STEP } from '../../constants';
import { getAssignmentText, getUnassignmentText } from '../../utils/common';
import { localizedStageSelector } from '../../selectors/stages';
import { Stage } from '../../reducers/stages';
import { Person } from '../../reducers/people';
import { SuggestedStep } from '../../reducers/steps';

import styles from './styles';

export interface JourneyStepEvent {
  id: string;
  _type: 'accepted_challenge';
  completed_at: Date;
  challenge_suggestion?: SuggestedStep;
  title: string;
  note?: string;
}

export interface JourneyStageEvent {
  id: string;
  _type: 'pathway_progression_audit';
  created_at: Date;
  old_pathway_stage?: Stage;
  new_pathway_stage: Stage;
  person: Person;
}

export interface JourneyAnswerSheetEvent {
  id: string;
  _type: 'answer_sheet';
  created_at: Date;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  survey: any;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  answers: any[];
}

export interface JourneyInteractionEvent {
  id: string;
  _type: 'interaction';
  created_at: Date;
  interaction_type_id: string;
  comment: string;
}

export interface JourneyAssignmentEvent {
  id: string;
  _type: 'contact_assignment';
  created_at: Date;
  assigned_to: Person;
  assigned_by?: Person;
}

export interface JourneyUnassignmentEvent {
  id: string;
  _type: 'contact_unassignment';
  created_at: Date;
  assigned_to: Person;
}

export interface JourneyItemProps {
  item:
    | JourneyStepEvent
    | JourneyStageEvent
    | JourneyAnswerSheetEvent
    | JourneyInteractionEvent
    | JourneyAssignmentEvent
    | JourneyUnassignmentEvent;
  myId: string;
  personFirstName: string;
}

const JourneyItem = ({ item, myId, personFirstName }: JourneyItemProps) => {
  const { t } = useTranslation('journeyItem');

  const { _type } = item;
  const { language } = i18next;

  let cardTitle: string | undefined;
  let cardBody: string | undefined;
  let iconType: string | undefined;

  const buildStageChangeContent = () => {
    const {
      old_pathway_stage,
      new_pathway_stage,
      person,
    } = item as JourneyStageEvent;
    const oldStage = localizedStageSelector(old_pathway_stage, i18next.language)
      .name;
    const isSelfStageChange = person.id === myId;
    const stageTranslationProps = {
      personName: person.first_name,
      oldStage,
      newStage: localizedStageSelector(new_pathway_stage, i18next.language)
        .name,
    };

    cardTitle = oldStage
      ? t('stageTitle', stageTranslationProps)
      : localizedStageSelector(new_pathway_stage, language).name;
    cardBody = oldStage
      ? isSelfStageChange
        ? t('stageTextSelf', stageTranslationProps)
        : t('stageText', stageTranslationProps)
      : isSelfStageChange
      ? t('stageStartSelf', stageTranslationProps)
      : t('stageStart', stageTranslationProps);
    iconType = 'journeyIcon';
  };

  const buildInteractionContent = () => {
    const { interaction_type_id, comment } = item as JourneyInteractionEvent;
    switch (interaction_type_id) {
      case INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id:
        cardTitle = t('interactionSpiritualConversation');
        iconType = 'spiritualConversationIcon';
        break;
      case INTERACTION_TYPES.MHInteractionTypeGospelPresentation.id:
        cardTitle = t('interactionGospel');
        iconType = 'gospelIcon';
        break;
      case INTERACTION_TYPES.MHInteractionTypePersonalDecision.id:
        cardTitle = t('interactionDecision');
        iconType = 'decisionIcon';
        break;
      case INTERACTION_TYPES.MHInteractionTypeHolySpiritConversation.id:
        cardTitle = t('interactionSpirit');
        iconType = 'spiritIcon';
        break;
      case INTERACTION_TYPES.MHInteractionTypeDiscipleshipConversation.id:
        cardTitle = t('interactionDiscipleshipConversation');
        iconType = 'discipleshipConversationIcon';
        break;
      case INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id:
        cardTitle = t('interactionSomethingCoolHappened');
        iconType = 'celebrateIcon';
        break;
      case INTERACTION_TYPES.MHInteractionTypeNote.id:
        cardTitle = t('interactionNote');
        iconType = 'commentIcon';
        break;
    }
    cardBody = comment;
  };

  switch (_type) {
    case ACCEPTED_STEP:
      const {
        challenge_suggestion: { pathway_stage = undefined } = {},
        title,
        note,
      } = item as JourneyStepEvent;
      cardTitle = t('stepTitle', {
        stageName:
          (pathway_stage &&
            ` ${localizedStageSelector(pathway_stage, language).name} `) ||
          ' ',
      });
      cardBody = note ? `${title}\n\n${note}` : title;
      iconType = 'stepsIcon';
      break;
    case 'pathway_progression_audit':
      buildStageChangeContent();
      break;
    case 'answer_sheet':
      const { survey } = item as JourneyAnswerSheetEvent;
      cardTitle = survey && survey.title;
      iconType = 'surveyIcon';
      break;
    case 'interaction':
      buildInteractionContent();
      break;
    case 'contact_assignment':
      cardTitle = getAssignmentText(myId, personFirstName, item);
      iconType = 'statusIcon';
      break;
    case 'contact_unassignment':
      cardTitle = getUnassignmentText(myId, personFirstName, item);
      iconType = 'statusIcon';
      break;
  }

  const renderDate = () => {
    const date =
      _type === ACCEPTED_STEP
        ? (item as JourneyStepEvent).completed_at
        : (item as
            | JourneyStageEvent
            | JourneyAnswerSheetEvent
            | JourneyInteractionEvent
            | JourneyAssignmentEvent
            | JourneyUnassignmentEvent).created_at;

    return <DateComponent date={date} style={styles.date} format="LL" />;
  };

  const renderTitle = () =>
    cardTitle ? <Text style={styles.title}>{cardTitle}</Text> : null;

  const renderText = () =>
    cardBody ? <Text style={styles.text}>{cardBody}</Text> : null;

  const renderIcon = () =>
    iconType ? (
      <Flex value={1}>
        <Icon
          name={iconType}
          type="MissionHub"
          size={32}
          style={[
            styles.icon,
            iconType === 'commentIcon' ? styles.commentIcon : {},
          ]}
        />
      </Flex>
    ) : null;

  const renderContent = () =>
    _type === 'answer_sheet' ? (
      renderSurvey()
    ) : (
      <Flex value={3.5} direction="column" style={styles.textWrap}>
        {renderDate()}
        {renderTitle()}
        {renderText()}
      </Flex>
    );

  const renderSurvey = () => {
    const { answers } = item as JourneyAnswerSheetEvent;
    return (
      <Flex value={3.5} direction="column" style={styles.textWrap}>
        {renderDate()}
        {renderTitle()}
        {answers &&
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          answers.map((a: any) => (
            <Flex direction="column" key={a.id}>
              <Text style={styles.question}>{a.question.label}</Text>
              <Text style={styles.text}>{a.value}</Text>
            </Flex>
          ))}
      </Flex>
    );
  };

  return (
    <Flex direction="row" align="center" style={styles.row}>
      {renderIcon()}
      {renderContent()}
    </Flex>
  );
};

export default JourneyItem;
