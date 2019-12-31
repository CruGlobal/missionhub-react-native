import 'react-native';
import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { ACCEPTED_STEP, INTERACTION_TYPES } from '../../../constants';
import { SuggestedStep } from '../../../reducers/steps';
import { Stage } from '../../../reducers/stages';
import { Person } from '../../../reducers/people';

import JourneyItem, {
  JourneyStepEvent,
  JourneyStageEvent,
  JourneyAnswerSheetEvent,
  JourneyInteractionEvent,
  JourneyAssignmentEvent,
  JourneyUnassignmentEvent,
} from '..';

const myId = '484893';
const person: Person = {
  id: '889433',
  _type: 'person',
  first_name: 'Test Person',
};
const date = new Date('2017-12-06T14:24:52Z');
const pathway_stage: Stage = {
  id: '5',
  name: 'Guiding',
  name_i18n: 'Guiding',
  position: 5,
  description: 'description',
  description_i18n: 'description',
  self_followup_description: 'description',
  icon_url: 'missionhub.com',
  localized_pathway_stages: [],
};
const challenge_suggestion: SuggestedStep = {
  id: '3',
  challenge_type: 'challenge',
  body: 'body',
  self_step: true,
  pathway_stage,
  locale: 'en-US',
};

describe('step', () => {
  const mockStep: JourneyStepEvent = {
    id: '1',
    _type: ACCEPTED_STEP,
    title: 'Test Step',
    completed_at: date,
  };

  it('is rendered correctly without comment', () => {
    renderWithContext(
      <JourneyItem
        item={mockStep}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('is rendered correctly with comment', () => {
    renderWithContext(
      <JourneyItem
        item={{ ...mockStep, note: 'test comment on completed step' }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('is rendered correctly with pathway stage', () => {
    renderWithContext(
      <JourneyItem
        item={{ ...mockStep, challenge_suggestion }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });
});

describe('stage', () => {
  const mockStageProgression: JourneyStageEvent = {
    id: '3',
    _type: 'pathway_progression_audit',
    old_pathway_stage: {
      ...pathway_stage,
      id: '1',
      name: 'Uninterested',
    },
    new_pathway_stage: {
      ...pathway_stage,
      id: '2',
      name: 'Curious',
    },
    created_at: date,
    person,
  };

  it('is rendered correctly with old stage for a contact', () => {
    renderWithContext(
      <JourneyItem
        item={mockStageProgression}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('is rendered correctly with old stage for self', () => {
    renderWithContext(
      <JourneyItem
        item={mockStageProgression}
        myId={person.id}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('is rendered correctly without old stage for a contact', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...mockStageProgression,
          old_pathway_stage: undefined,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('is rendered correctly without old stage for self', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...mockStageProgression,
          old_pathway_stage: undefined,
        }}
        myId={person.id}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });
});

describe('answer_sheet', () => {
  it('renders correctly', () => {
    const item: JourneyAnswerSheetEvent = {
      id: '5',
      _type: 'answer_sheet',
      survey: { title: 'Test Survey' },
      answers: [
        { id: '1', question: { label: 'Question 1' }, value: 'Answer 1' },
        { id: '2', question: { label: 'Question 2' }, value: 'Answer 2' },
        { id: '3', question: { label: 'Question 3' }, value: 'Answer 3' },
      ],
      created_at: date,
    };

    renderWithContext(
      <JourneyItem
        item={item}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });
});

describe('interaction', () => {
  const interactionItem: JourneyInteractionEvent = {
    id: '4',
    _type: 'interaction',
    interaction_type_id: '1',
    comment: 'Test Interaction',
    created_at: date,
  };

  it('renders Spiritual Conversation correctly', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...interactionItem,
          interaction_type_id:
            INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('renders Gospel Presentation correctly', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...interactionItem,
          interaction_type_id:
            INTERACTION_TYPES.MHInteractionTypeGospelPresentation.id,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('renders Personal Decision correctly', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...interactionItem,
          interaction_type_id:
            INTERACTION_TYPES.MHInteractionTypePersonalDecision.id,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('renders Holy Spirit Conversation correctly', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...interactionItem,
          interaction_type_id:
            INTERACTION_TYPES.MHInteractionTypeHolySpiritConversation.id,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('renders Discipleship Conversation correctly', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...interactionItem,
          interaction_type_id:
            INTERACTION_TYPES.MHInteractionTypeDiscipleshipConversation.id,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('renders Something Cool Happened correctly', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...interactionItem,
          interaction_type_id:
            INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });

  it('renders Note correctly', () => {
    renderWithContext(
      <JourneyItem
        item={{
          ...interactionItem,
          interaction_type_id: INTERACTION_TYPES.MHInteractionTypeNote.id,
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });
});

describe('contact_assignment', () => {
  it('renders correctly', () => {
    const item: JourneyAssignmentEvent = {
      id: '5',
      _type: 'contact_assignment',
      created_at: date,
      assigned_to: { id: myId },
    };

    renderWithContext(
      <JourneyItem
        item={item}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });
});

describe('contact_unassignment', () => {
  it('renders correctly', () => {
    const item: JourneyUnassignmentEvent = {
      id: '6',
      _type: 'contact_unassignment',
      created_at: date,
      assigned_to: { id: myId },
    };

    renderWithContext(
      <JourneyItem
        item={item}
        myId={myId}
        personFirstName={person.first_name}
      />,
    ).snapshot();
  });
});
