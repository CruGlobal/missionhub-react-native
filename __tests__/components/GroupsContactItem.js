import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import GroupsContactItem from '../../src/components/GroupsContactItem';
import { INTERACTION_TYPES } from '../../src/constants';

const created_at = '2018-05-29T17:02:02Z';
const item = {
  id: '1',
  created_at,
  text: 'Someone had a spiritual conversation',
  comment: 'Some comment',
  _type: 'interaction',
  interaction_type_id: 2,
  initiators: [{ full_name: 'Someone' }],
  receiver: { first_name: 'Contact' },
  assigned_to: { id: '10', first_name: 'Iron Man' },
  assigned_by: { id: '11', first_name: 'Captain America' },
};

const person = {
  first_name: 'Test User',
};

const myId = '234234';

it('renders survey item', () => {
  testSnapshotShallow(
    <GroupsContactItem
      person={person}
      myId={myId}
      item={{
        id: '1',
        created_at,
        _type: 'answer_sheet',
        survey: {
          title: 'Survey Title',
        },
        answers: [
          { id: 'a1', question: { label: 'Label 1' }, value: 'Answer 1' },
        ],
      }}
    />,
  );
});

it('renders contact assignment item', () => {
  const newItem = {
    ...item,
    _type: 'contact_assignment',
    created_at,
  };

  testSnapshotShallow(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
  );
});

it('renders contact unassignment item', () => {
  const newItem = {
    ...item,
    _type: 'contact_unassignment',
    created_at,
  };

  testSnapshotShallow(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
  );
});

function testInteraction(id) {
  testSnapshotShallow(
    <GroupsContactItem
      person={person}
      item={{
        ...item,
        interaction_type_id: id,
      }}
      myId={myId}
    />,
  );
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
