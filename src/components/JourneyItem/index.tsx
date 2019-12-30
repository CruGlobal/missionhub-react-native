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

interface JourneyEvent {
  id: string;
  _type:
    | 'accepted_challenge'
    | 'pathway_progression_audit'
    | 'answer_sheet'
    | 'interaction'
    | 'contact_assignment'
    | 'contact_unassignment';
  text: string;
  title: string;
  completed_at: Date;
  created_at: Date;
  old_pathway_stage?: Stage;
  new_pathway_stage?: Stage;
  person?: Person;
  challenge_suggestion?: SuggestedStep;
  survey?: any;
  answers?: any[];
  interaction_type_id?: string;
  note?: string;
  comment?: string;
}

interface JourneyItemProps {
  item: JourneyEvent;
  myId: string;
  personFirstName: string;
}

const interactions = Object.keys(INTERACTION_TYPES).reduce(
  (interactions, key) => {
    const interaction = INTERACTION_TYPES[key];
    return {
      ...interactions,
      [interaction.id]: interaction,
    };
  },
  {},
);

const JourneyItem = ({ item, myId, personFirstName }: JourneyItemProps) => {
  const { t } = useTranslation('journeyItem');

  const {
    _type,
    old_pathway_stage,
    new_pathway_stage,
    person,
    completed_at,
    created_at,
    challenge_suggestion,
    survey,
    answers,
    interaction_type_id,
    title,
    note,
    comment,
  } = item;
  const { language } = i18next;

  let cardTitle: string | undefined;
  let cardBody: string | undefined;
  let iconType: string | undefined;

  const buildStageChangeContent = () => {
    const oldStage = localizedStageSelector(old_pathway_stage, i18next.language)
      .name;
    const isSelfStageChange = person && person.id === myId;
    const stageTranslationProps = {
      personName: person && person.first_name,
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

  switch (_type) {
    case ACCEPTED_STEP:
      const { pathway_stage } = challenge_suggestion || {};
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
      cardTitle = survey && survey.title;
      iconType = 'surveyIcon';
      break;
    case 'interaction':
      const interaction = interactions[interaction_type_id];
      cardTitle = interaction && t(interaction.translationKey);
      cardBody = comment;
      iconType = interaction && interaction.iconName;
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

  const renderDate = () => (
    <DateComponent
      date={_type === ACCEPTED_STEP ? completed_at : created_at}
      style={styles.date}
      format="LL"
    />
  );

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
    return (
      <Flex value={3.5} direction="column" style={styles.textWrap}>
        {renderDate()}
        {renderTitle()}
        {answers &&
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
