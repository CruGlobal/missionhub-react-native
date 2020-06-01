/* eslint max-lines: 0 */

import 'react-native';
import React from 'react';
import MockDate from 'mockdate';

import { GROUP_ONBOARDING_TYPES } from '../../Groups/OnboardingCard';
import { renderWithContext } from '../../../../testUtils';
import { GLOBAL_COMMUNITY_ID, ORG_PERMISSIONS } from '../../../constants';
import { getImpactSummary } from '../../../actions/impact';

import ImpactView from '..';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/impact');
MockDate.set('2018-09-12 12:00:00 PM GMT+0');

(getImpactSummary as jest.Mock).mockReturnValue({ type: 'getImpactSummary' });

const userCreatedOrgId = '43';

const me = {
  id: '1',
  type: 'person',
  first_name: 'ME',
  organizational_permissions: [
    {
      organization_id: userCreatedOrgId,
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
const userCreatedOrgImpact = {
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
  user_created: true,
};
const userCreatedOrg = {
  id: userCreatedOrgId,
  name: 'User Created Org',
  user_created: true,
};

const state = {
  auth: {
    person: me,
  },
  impact: {
    summary: {
      [`${me.id}-`]: myImpact,
      [`${person.id}-`]: personImpact,
      [`-${userCreatedOrgId}`]: userCreatedOrgImpact,
      '-': globalImpact,
    },
  },
  organizations: {
    all: [globalOrg, userCreatedOrg],
  },
  swipe: {
    groupOnboarding: {
      [GROUP_ONBOARDING_TYPES.impact]: false,
    },
  },
};

describe('ImpactView', () => {
  it('should refresh impact data', () => {
    renderWithContext(<ImpactView person={me} />, { initialState: state });
    expect(getImpactSummary).toHaveBeenCalledTimes(2);
  });

  describe('ME person personal impact view', () => {
    it('renders empty state', () => {
      renderWithContext(<ImpactView person={me} />, {
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
    });

    it('renders singular state', () => {
      renderWithContext(<ImpactView person={me} />, {
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
    });

    it('renders plural state', () => {
      renderWithContext(<ImpactView person={me} />, {
        initialState: state,
      }).snapshot();
    });
  });

  describe('ME person impact view for user created org', () => {
    const meWithOrgPermission = {
      ...me,
      organizational_permissions: [
        {
          organization_id: userCreatedOrgId,
          permission_id: ORG_PERMISSIONS.OWNER,
        },
      ],
    };

    it('renders empty state', () => {
      renderWithContext(
        <ImpactView person={meWithOrgPermission} orgId={userCreatedOrgId} />,
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
    });

    it('renders singular state', () => {
      renderWithContext(
        <ImpactView person={meWithOrgPermission} orgId={userCreatedOrgId} />,
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
    });

    it('renders plural state', () => {
      renderWithContext(
        <ImpactView person={meWithOrgPermission} orgId={userCreatedOrgId} />,
        {
          initialState: state,
        },
      ).snapshot();
    });
  });

  describe('user created member impact', () => {
    const personWithOrgPermission = {
      ...person,
      organizational_permissions: [
        {
          organization_id: userCreatedOrgId,
          permission_id: ORG_PERMISSIONS.OWNER,
        },
      ],
    };

    it('renders empty state', () => {
      renderWithContext(
        <ImpactView
          person={personWithOrgPermission}
          orgId={userCreatedOrgId}
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
      ).snapshot();
    });

    it('renders singular state', () => {
      renderWithContext(
        <ImpactView
          person={personWithOrgPermission}
          orgId={userCreatedOrgId}
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
      ).snapshot();
    });

    it('renders plural state', () => {
      renderWithContext(
        <ImpactView
          person={personWithOrgPermission}
          orgId={userCreatedOrgId}
        />,
        {
          initialState: state,
        },
      ).snapshot();
    });
  });

  describe('user-created community impact', () => {
    it('renders empty state', () => {
      renderWithContext(<ImpactView orgId={userCreatedOrgId} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`-${userCreatedOrgId}`]: {
                ...userCreatedOrgImpact,
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
    });

    it('renders singular state', () => {
      renderWithContext(<ImpactView orgId={userCreatedOrgId} />, {
        initialState: {
          ...state,
          impact: {
            ...state.impact,
            summary: {
              ...state.impact.summary,
              [`-${userCreatedOrgId}`]: {
                ...userCreatedOrgImpact,
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
    });

    it('renders plural state', () => {
      renderWithContext(<ImpactView orgId={userCreatedOrgId} />, {
        initialState: state,
      }).snapshot();
    });
  });

  describe('global community impact', () => {
    it('renders empty state', () => {
      renderWithContext(<ImpactView orgId={GLOBAL_COMMUNITY_ID} />, {
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
    });

    it('renders singular state', () => {
      renderWithContext(<ImpactView orgId={GLOBAL_COMMUNITY_ID} />, {
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
    });

    it('renders plural state', () => {
      renderWithContext(<ImpactView orgId={GLOBAL_COMMUNITY_ID} />, {
        initialState: state,
      }).snapshot();
    });
  });
});
