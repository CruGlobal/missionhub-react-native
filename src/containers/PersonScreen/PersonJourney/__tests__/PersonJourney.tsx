import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { JOURNEY_EDIT_FLOW } from '../../../../routes/constants';
import {
  ACCEPTED_STEP,
  EDIT_JOURNEY_STEP,
  EDIT_JOURNEY_ITEM,
  ORG_PERMISSIONS,
} from '../../../../constants';
import { renderWithContext } from '../../../../../testUtils';
import RowSwipeable from '../../../../components/RowSwipeable';
import { PersonCollapsibleHeaderContext } from '../../PersonTabs';
import { navigatePush } from '../../../../actions/navigation';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';

import { PersonJourney } from '..';

const mockAddComment = jest.fn(() => Promise.resolve());
const mockEditComment = jest.fn(() => Promise.resolve());
jest.mock('react-native-device-info');
jest.mock('../../../../actions/interactions', () => ({
  addNewInteraction: () => mockAddComment,
  editComment: () => mockEditComment,
}));
jest.mock(
  '../../../../components/JourneyCommentBox',
  () => 'JourneyCommentBox',
);
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../actions/navigation');

(navigatePush as jest.Mock).mockReturnValue({ type: 'navigatePush' });

const myId = '111';
const personId = '123';
const orgId = '222';

const mockMePerson = {
  id: myId,
  first_name: 'Mike',
  organizational_permissions: [
    { organization_id: orgId, permission_id: ORG_PERMISSIONS.OWNER },
  ],
};
const mockPerson = {
  id: personId,
  first_name: 'Ben',
  organizational_permissions: [
    { organization_id: orgId, permission_id: ORG_PERMISSIONS.USER },
  ],
};

const mockJourneyList = [
  { _type: ACCEPTED_STEP, id: '84472', completed_at: '2010-01-01 12:12:12' },
];

const initialState = {
  auth: {
    person: mockMePerson,
  },
  swipe: {
    journey: false,
  },
  journey: {
    personal: {},
  },
  people: { people: { [personId]: mockPerson, [myId]: mockMePerson } },
};

describe('PersonJourney', () => {
  it('renders loading screen correctly', () => {
    renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState,
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'our journey'], {
      assignmentType: { personId },
    });
  });

  it('renders null screen correctly', () => {
    renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState: {
          ...initialState,
          journey: {
            personal: { [personId]: [] },
          },
        },
      },
    ).snapshot();
  });

  it('renders screen with steps correctly', () => {
    renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState: {
          ...initialState,
          journey: {
            personal: { [personId]: mockJourneyList },
          },
        },
      },
    ).snapshot();
  });

  it('renders screen with steps for me correctly', () => {
    renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId: myId },
        initialState: {
          ...initialState,
          journey: {
            personal: { [myId]: mockJourneyList },
          },
        },
      },
    ).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith(['person', 'my journey'], {
      assignmentType: { personId: myId },
    });
  });
});

describe('journey methods', () => {
  it('renders a step', () => {
    renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState: {
          ...initialState,
          journey: {
            personal: {
              [personId]: [
                {
                  id: '123',
                  note: '123',
                  _type: ACCEPTED_STEP,
                  completed_at: '2010-01-01 12:12:12',
                },
              ],
            },
          },
        },
      },
    ).snapshot();
  });

  it('renders an interaction row', () => {
    renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState: {
          ...initialState,
          journey: {
            personal: {
              [personId]: [
                {
                  id: '123',
                  comment: '123',
                  _type: 'interaction',
                  created_at: '2010-01-01 12:12:12',
                },
              ],
            },
          },
        },
      },
    ).snapshot();
  });

  it('renders a stage change row', () => {
    renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState: {
          ...initialState,
          journey: {
            personal: {
              [personId]: [
                {
                  id: '124',
                  _type: 'pathway_progression_audit',
                  person: mockPerson,
                  created_at: '2010-01-01 12:12:12',
                  new_pathway_stage: {
                    id: '1',
                    name: 'Curious',
                  },
                },
              ],
            },
          },
        },
      },
    ).snapshot();
  });

  it('handles edit interaction for step', () => {
    const interactionId = '1';
    const interactionNote = 'note';

    const interaction = {
      id: interactionId,
      note: interactionNote,
      _type: ACCEPTED_STEP,
    };

    const { getByType } = renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState: {
          ...initialState,
          journey: {
            personal: {
              [personId]: [interaction],
            },
          },
        },
      },
    );

    fireEvent(getByType(RowSwipeable), 'onEdit', interaction);

    expect(navigatePush).toHaveBeenCalledWith(JOURNEY_EDIT_FLOW, {
      id: interactionId,
      type: EDIT_JOURNEY_STEP,
      initialText: interactionNote,
      personId,
    });
  });

  it('handles edit interaction for other', () => {
    const interactionId = '1';
    const interactionComment = 'comment';

    const interaction = {
      id: interactionId,
      comment: interactionComment,
      _type: 'other',
    };

    const { getByType } = renderWithContext(
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />,
      {
        navParams: { personId },
        initialState: {
          ...initialState,
          journey: {
            personal: {
              [personId]: [interaction],
            },
          },
        },
      },
    );

    fireEvent(getByType(RowSwipeable), 'onEdit', interaction);

    expect(navigatePush).toHaveBeenCalledWith(JOURNEY_EDIT_FLOW, {
      id: interactionId,
      type: EDIT_JOURNEY_ITEM,
      initialText: interactionComment,
      personId,
    });
  });
});
