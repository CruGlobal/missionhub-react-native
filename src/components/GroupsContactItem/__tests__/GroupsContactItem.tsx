import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import { renderWithContext } from '../../../../testUtils';
import { INTERACTION_TYPES } from '../../../constants';

import GroupsContactItem from '..';

const mockDate = moment('2019-08-25 13:00:00').toDate();
MockDate.set(mockDate, 0);

const created_at = mockDate.toString();
const item = {
  id: '1',
  created_at,
  text: 'Someone had a spiritual conversation',
  comment: 'Some comment',
  _type: 'interaction',
  interaction_type_id: '2',
  initiators: [{ full_name: 'Someone' }],
  receiver: { first_name: 'Contact' },
  assigned_to: { id: '10', first_name: 'Iron Man' },
  assigned_by: { id: '11', first_name: 'Captain America' },
  person: { first_name: 'Item person' },
  old_pathway_stage: {
    id: '1',
    name: 'stage',
    description: 'Test Stage',
    self_followup_description: 'My Test Stage',
    position: 0,
    name_i18n: '',
    description_i18n: '',
    icon_url: '',
    localized_pathway_stages: [],
  },
  new_pathway_stage: {
    id: '1',
    name: 'stage',
    description: 'Test Stage',
    self_followup_description: 'My Test Stage',
    position: 0,
    name_i18n: '',
    description_i18n: '',
    icon_url: '',
    localized_pathway_stages: [],
  },
};

const person = {
  first_name: 'Test User',
};

const myId = '234234';

it('renders survey item', () => {
  renderWithContext(
    <GroupsContactItem
      person={person}
      myId={myId}
      item={{
        ...item,
        id: '1',
        created_at,
        _type: 'answer_sheet',
        survey: {
          title: 'Survey Title',
        },
        comment: '',
        answers: [
          { id: 'a1', question: { label: 'Label 1' }, value: 'Answer 1' },
        ],
      }}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('renders contact assignment item', () => {
  const newItem = {
    ...item,
    _type: 'contact_assignment',
    created_at,
  };

  renderWithContext(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
    { noWrappers: true },
  ).snapshot();
});

it('renders contact unassignment item', () => {
  const newItem = {
    ...item,
    _type: 'contact_unassignment',
    created_at,
  };

  renderWithContext(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
    { noWrappers: true },
  ).snapshot();
});

it('renders contact unassignment item with note', () => {
  const newItem = {
    ...item,
    _type: 'contact_unassignment',
    created_at,
    unassignment_reason: 'unassignment note',
  };

  renderWithContext(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
    { noWrappers: true },
  ).snapshot();
});

it('renders pathway progression audit with old pathway stage', () => {
  const newItem = {
    ...item,
    _type: 'pathway_progression_audit',
  };

  renderWithContext(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
    { noWrappers: true },
  ).snapshot();
});

it('renders pathway progression audit without old pathway stage', () => {
  const newItem = {
    ...item,
    _type: 'pathway_progression_audit',
    old_pathway_stage: undefined,
  };

  renderWithContext(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
    { noWrappers: true },
  ).snapshot();
});

function testInteraction(id: string) {
  renderWithContext(
    <GroupsContactItem
      person={person}
      item={{
        ...item,
        interaction_type_id: id,
      }}
      myId={myId}
    />,
    { noWrappers: true },
  ).snapshot();
}

describe('interaction items', () => {
  it('should render spiritual conversation', () => {
    testInteraction(
      INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id,
    );
  });
  it('should render gospel presentation', () => {
    testInteraction(INTERACTION_TYPES.MHInteractionTypeGospelPresentation.id);
  });
  it('should render personal decision', () => {
    testInteraction(INTERACTION_TYPES.MHInteractionTypePersonalDecision.id);
  });
  it('should render holy spirit conversation', () => {
    testInteraction(
      INTERACTION_TYPES.MHInteractionTypeHolySpiritConversation.id,
    );
  });
  it('should render discipleship conversation', () => {
    testInteraction(
      INTERACTION_TYPES.MHInteractionTypeDiscipleshipConversation.id,
    );
  });
  it('should render something cool happened', () => {
    testInteraction(
      INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id,
    );
  });
  it('should render note', () => {
    testInteraction(INTERACTION_TYPES.MHInteractionTypeNote.id);
  });
});
