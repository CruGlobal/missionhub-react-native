/* eslint max-lines: 0 */

import 'react-native';
import React from 'react';
import MockDate from 'mockdate';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import { GROUP_ONBOARDING_TYPES } from '../../Groups/OnboardingCard';
import { renderWithContext } from '../../../../testUtils';
import { GLOBAL_COMMUNITY_ID, ORG_PERMISSIONS } from '../../../constants';
import { getImpactSummary } from '../../../actions/impact';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import ImpactView from '..';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/impact');
MockDate.set('2018-09-12 12:00:00 PM GMT+0');

(getImpactSummary as jest.Mock).mockReturnValue({ type: 'getImpactSummary' });

const communityId = '43';

const me = {
  id: '1',
  type: 'person',
  first_name: 'ME',
  organizational_permissions: [
    {
      organization_id: communityId,
      permission_id: ORG_PERMISSIONS.USER,
    },
  ],
};
const person = { id: '2', type: 'person', first_name: 'Test Fname' };
const myImpact = {
  id: 'me-2018',
  type: 'impact_report',
  steps_count: 10,
  receivers_count: 5,
  pathway_moved_count: 3,
};
const personImpact = {
  id: '1-2018',
  type: 'impact_report',
  steps_count: 11,
  receivers_count: 6,
  pathway_moved_count: 4,
};
const orgImpact = {
  id: '43-2018',
  type: 'impact_report',
  steps_count: 13,
  receivers_count: 8,
  pathway_moved_count: 6,
};
const globalImpact = {
  id: 'global-2018',
  type: 'impact_report',
  steps_count: 10,
  receivers_count: 5,
  step_owners_count: 200,
  pathway_moved_count: 50,
};
const globalOrg = {
  id: GLOBAL_COMMUNITY_ID,
  name: 'Global Community',
};
const org = {
  id: communityId,
  name: 'Org',
};

const state = {
  auth: {
    person: me,
  },
  impact: {
    summary: {
      [`${me.id}-`]: myImpact,
      [`${person.id}-`]: personImpact,
      [`-${communityId}`]: orgImpact,
      '-': globalImpact,
    },
  },
  organizations: {
    all: [globalOrg, org],
  },
  swipe: {
    groupOnboarding: {
      [GROUP_ONBOARDING_TYPES.impact]: false,
    },
  },
};

describe('ImpactView', () => {
  it('should refresh impact data', () => {
    renderWithContext(<ImpactView personId={me.id} />, { initialState: state });

    expect(getImpactSummary).toHaveBeenCalledTimes(2);
    expect(useAnalytics).toHaveBeenCalledWith(['person', 'my impact'], {
      assignmentType: { personId: me.id, communityId: 'personal' },
      permissionType: undefined,
    });
  });

  describe('ME person personal impact view', () => {
    it('renders empty state', () => {
      renderWithContext(<ImpactView personId={me.id} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`${me.id}-`]: {
                ...myImpact,
                steps_count: 0,
                pathway_moved_count: 0,
              },
              '-': {
                ...globalImpact,
                steps_count: 0,
                step_owners_count: 0,
                pathway_moved_count: 0,
              },
            },
          },
        },
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'my impact'], {
        assignmentType: { personId: me.id, communityId: 'personal' },
        permissionType: undefined,
      });
    });

    it('renders singular state', () => {
      renderWithContext(<ImpactView personId={me.id} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`${me.id}-`]: {
                ...myImpact,
                steps_count: 1,
                receivers_count: 1,
                pathway_moved_count: 1,
              },
              '-': {
                ...globalImpact,
                steps_count: 1,
                receivers_count: 1,
                step_owners_count: 1,
                pathway_moved_count: 1,
              },
            },
          },
        },
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'my impact'], {
        assignmentType: { personId: me.id, communityId: 'personal' },
        permissionType: undefined,
      });
    });

    it('renders plural state', () => {
      renderWithContext(<ImpactView personId={me.id} />, {
        initialState: state,
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'my impact'], {
        assignmentType: { personId: me.id, communityId: 'personal' },
        permissionType: undefined,
      });
    });
  });

  describe('ME person impact view for org', () => {
    const meWithOrgPermission = {
      ...me,
      organizational_permissions: [
        {
          organization_id: communityId,
          permission_id: ORG_PERMISSIONS.OWNER,
        },
      ],
    };

    it('renders empty state', () => {
      renderWithContext(
        <ImpactView
          personId={meWithOrgPermission.id}
          communityId={communityId}
        />,
        {
          initialState: {
            ...state,
            impact: {
              ...state.impact,
              summary: {
                ...state.impact.summary,
                [`${me.id}-`]: {
                  ...myImpact,
                  steps_count: 0,
                  pathway_moved_count: 0,
                },
                '-': {
                  ...globalImpact,
                  steps_count: 0,
                  step_owners_count: 0,
                  pathway_moved_count: 0,
                },
              },
            },
          },
        },
      ).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'my impact'], {
        assignmentType: {
          personId: me.id,
          communityId,
        },
        permissionType: undefined,
      });
    });

    it('renders singular state', () => {
      renderWithContext(
        <ImpactView
          personId={meWithOrgPermission.id}
          communityId={communityId}
        />,
        {
          initialState: {
            ...state,
            impact: {
              ...state.impact,
              summary: {
                ...state.impact.summary,
                [`${me.id}-`]: {
                  ...myImpact,
                  steps_count: 1,
                  receivers_count: 1,
                  pathway_moved_count: 1,
                },
                '-': {
                  ...globalImpact,
                  steps_count: 1,
                  receivers_count: 1,
                  step_owners_count: 1,
                  pathway_moved_count: 1,
                },
              },
            },
          },
        },
      ).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'my impact'], {
        assignmentType: {
          personId: me.id,
          communityId,
        },
        permissionType: undefined,
      });
    });

    it('renders plural state', () => {
      renderWithContext(
        <ImpactView
          personId={meWithOrgPermission.id}
          communityId={communityId}
        />,
        {
          initialState: state,
        },
      ).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'my impact'], {
        assignmentType: {
          personId: me.id,
          communityId,
        },
        permissionType: undefined,
      });
    });
  });

  describe('member impact', () => {
    const personWithOrgPermission = {
      ...person,
      organizational_permissions: [
        {
          organization_id: communityId,
          permission_id: ORG_PERMISSIONS.OWNER,
        },
      ],
    };

    it('renders empty state', async () => {
      const { snapshot } = renderWithContext(
        <ImpactView
          personId={personWithOrgPermission.id}
          communityId={communityId}
        />,
        {
          initialState: {
            ...state,
            impact: {
              ...state.impact,
              summary: {
                ...state.impact.summary,
                [`${person.id}-`]: {
                  ...personImpact,
                  steps_count: 0,
                  pathway_moved_count: 0,
                },
                '-': {
                  ...globalImpact,
                  steps_count: 0,
                  step_owners_count: 0,
                  pathway_moved_count: 0,
                },
              },
            },
          },
        },
      );

      await flushMicrotasksQueue();

      snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'impact'], {
        assignmentType: {
          personId: person.id,
          communityId,
        },
        permissionType: undefined,
      });
    });

    it('renders singular state', async () => {
      const { snapshot } = renderWithContext(
        <ImpactView
          personId={personWithOrgPermission.id}
          communityId={communityId}
        />,
        {
          initialState: {
            ...state,
            impact: {
              ...state.impact,
              summary: {
                ...state.impact.summary,
                [`${person.id}-`]: {
                  ...personImpact,
                  steps_count: 1,
                  receivers_count: 1,
                  pathway_moved_count: 1,
                },
                '-': {
                  ...globalImpact,
                  steps_count: 1,
                  receivers_count: 1,
                  step_owners_count: 1,
                  pathway_moved_count: 1,
                },
              },
            },
          },
        },
      );

      await flushMicrotasksQueue();

      snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'impact'], {
        assignmentType: {
          personId: person.id,
          communityId,
        },
        permissionType: undefined,
      });
    });

    it('renders plural state', async () => {
      const { snapshot } = renderWithContext(
        <ImpactView
          personId={personWithOrgPermission.id}
          communityId={communityId}
        />,
        {
          initialState: state,
        },
      );

      await flushMicrotasksQueue();

      snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['person', 'impact'], {
        assignmentType: {
          personId: person.id,
          communityId,
        },
        permissionType: undefined,
      });
    });
  });

  describe('user-created community impact', () => {
    it('renders empty state', () => {
      renderWithContext(<ImpactView communityId={communityId} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`-${communityId}`]: {
                ...orgImpact,
                steps_count: 0,
                pathway_moved_count: 0,
              },
              '-': {
                ...globalImpact,
                steps_count: 0,
                step_owners_count: 0,
                pathway_moved_count: 0,
              },
            },
          },
        },
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['community', 'impact'], {
        assignmentType: undefined,
        permissionType: { communityId },
      });
    });

    it('renders singular state', () => {
      renderWithContext(<ImpactView communityId={communityId} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`-${communityId}`]: {
                ...orgImpact,
                steps_count: 1,
                receivers_count: 1,
                pathway_moved_count: 1,
              },
              '-': {
                ...globalImpact,
                steps_count: 1,
                receivers_count: 1,
                step_owners_count: 1,
                pathway_moved_count: 1,
              },
            },
          },
        },
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['community', 'impact'], {
        assignmentType: undefined,
        permissionType: { communityId },
      });
    });

    it('renders plural state', () => {
      renderWithContext(<ImpactView communityId={communityId} />, {
        initialState: state,
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['community', 'impact'], {
        assignmentType: undefined,
        permissionType: { communityId },
      });
    });
  });

  describe('global community impact', () => {
    it('renders empty state', () => {
      renderWithContext(<ImpactView communityId={GLOBAL_COMMUNITY_ID} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`${me.id}-`]: {
                ...myImpact,
                steps_count: 0,
                pathway_moved_count: 0,
              },
              '-': {
                ...globalImpact,
                steps_count: 0,
                step_owners_count: 0,
                pathway_moved_count: 0,
              },
            },
          },
        },
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['community', 'impact'], {
        assignmentType: undefined,
        permissionType: { communityId: GLOBAL_COMMUNITY_ID },
      });
    });

    it('renders singular state', () => {
      renderWithContext(<ImpactView communityId={GLOBAL_COMMUNITY_ID} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`${me.id}-`]: {
                ...myImpact,
                steps_count: 1,
                receivers_count: 1,
                pathway_moved_count: 1,
              },
              '-': {
                ...globalImpact,
                steps_count: 1,
                receivers_count: 1,
                step_owners_count: 1,
                pathway_moved_count: 1,
              },
            },
          },
        },
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['community', 'impact'], {
        assignmentType: undefined,
        permissionType: { communityId: GLOBAL_COMMUNITY_ID },
      });
    });

    it('renders plural state', () => {
      renderWithContext(<ImpactView communityId={GLOBAL_COMMUNITY_ID} />, {
        initialState: state,
      }).snapshot();

      expect(useAnalytics).toHaveBeenCalledWith(['community', 'impact'], {
        assignmentType: undefined,
        permissionType: { communityId: GLOBAL_COMMUNITY_ID },
      });
    });
  });
});
