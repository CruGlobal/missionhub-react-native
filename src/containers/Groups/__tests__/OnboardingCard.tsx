import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
  PermissionTypesEnum,
} from '../OnboardingCard';
import { removeGroupOnboardingCard } from '../../../actions/swipe';

jest.mock('../../../actions/swipe');

const groupOnboarding = {
  [GROUP_ONBOARDING_TYPES.celebrate]: true,
  [GROUP_ONBOARDING_TYPES.challenges]: true,
  [GROUP_ONBOARDING_TYPES.members]: true,
  [GROUP_ONBOARDING_TYPES.impact]: true,
  [GROUP_ONBOARDING_TYPES.contacts]: true,
  [GROUP_ONBOARDING_TYPES.surveys]: true,
  [GROUP_ONBOARDING_TYPES.steps]: true,
};

(removeGroupOnboardingCard as jest.Mock).mockReturnValue({
  type: 'removed group onboarding card',
});

describe('OnboardingCard', () => {
  it('render celebrate card', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
      {
        initialState: {
          swipe: {
            groupOnboarding,
          },
        },
      },
    ).snapshot();
  });

  it('render celebrate card hidden', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
      {
        initialState: {
          swipe: {
            groupOnboarding: {
              ...groupOnboarding,
              [GROUP_ONBOARDING_TYPES.celebrate]: false,
            },
          },
        },
      },
    ).snapshot();
  });

  it('render challenges card | Admin', () => {
    renderWithContext(
      <OnboardingCard
        type={GROUP_ONBOARDING_TYPES.challenges}
        permissions={PermissionTypesEnum.admin}
      />,
      {
        initialState: {
          swipe: {
            groupOnboarding,
          },
        },
      },
    ).snapshot();
  });

  it('render challenges card | Member', () => {
    renderWithContext(
      <OnboardingCard
        type={GROUP_ONBOARDING_TYPES.challenges}
        permissions={PermissionTypesEnum.member}
      />,
      {
        initialState: {
          swipe: {
            groupOnboarding,
          },
        },
      },
    ).snapshot();
  });

  it('render challenges card hidden', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
      {
        initialState: {
          swipe: {
            groupOnboarding: {
              ...groupOnboarding,
              [GROUP_ONBOARDING_TYPES.challenges]: false,
            },
          },
        },
      },
    ).snapshot();
  });

  it('render members card', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />,
      {
        initialState: {
          swipe: {
            groupOnboarding,
          },
        },
      },
    ).snapshot();
  });

  it('render members card hidden', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.members} />,
      {
        initialState: {
          swipe: {
            groupOnboarding: {
              ...groupOnboarding,
              [GROUP_ONBOARDING_TYPES.members]: false,
            },
          },
        },
      },
    ).snapshot();
  });

  it('render impact card', () => {
    renderWithContext(<OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />, {
      initialState: {
        swipe: {
          groupOnboarding,
        },
      },
    }).snapshot();
  });

  it('render impact card hidden', () => {
    renderWithContext(<OnboardingCard type={GROUP_ONBOARDING_TYPES.impact} />, {
      initialState: {
        swipe: {
          groupOnboarding: {
            ...groupOnboarding,
            [GROUP_ONBOARDING_TYPES.impact]: false,
          },
        },
      },
    }).snapshot();
  });

  it('render contacts card', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.contacts} />,
      {
        initialState: {
          swipe: {
            groupOnboarding,
          },
        },
      },
    ).snapshot();
  });

  it('render contacts card hidden', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.contacts} />,
      {
        initialState: {
          swipe: {
            groupOnboarding: {
              ...groupOnboarding,
              [GROUP_ONBOARDING_TYPES.contacts]: false,
            },
          },
        },
      },
    ).snapshot();
  });

  it('render surveys card', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />,
      {
        initialState: {
          swipe: {
            groupOnboarding,
          },
        },
      },
    ).snapshot();
  });

  it('render surveys card hidden', () => {
    renderWithContext(
      <OnboardingCard type={GROUP_ONBOARDING_TYPES.surveys} />,
      {
        initialState: {
          swipe: {
            groupOnboarding: {
              ...groupOnboarding,
              [GROUP_ONBOARDING_TYPES.surveys]: false,
            },
          },
        },
      },
    ).snapshot();
  });

  it('render steps card', () => {
    renderWithContext(<OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />, {
      initialState: {
        swipe: {
          groupOnboarding,
        },
      },
    }).snapshot();
  });
  it('render steps card hidden', () => {
    renderWithContext(<OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />, {
      initialState: {
        swipe: {
          groupOnboarding: {
            ...groupOnboarding,
            [GROUP_ONBOARDING_TYPES.steps]: false,
          },
        },
      },
    }).snapshot();
  });
});

it('handles press event from the close button', () => {
  const { snapshot, getByTestId } = renderWithContext(
    <OnboardingCard type={GROUP_ONBOARDING_TYPES.celebrate} />,
    {
      initialState: {
        swipe: {
          groupOnboarding,
        },
      },
    },
  );
  snapshot();
  fireEvent.press(getByTestId('IconButton'));
  expect(removeGroupOnboardingCard).toHaveBeenCalledWith(
    GROUP_ONBOARDING_TYPES.celebrate,
  );
});
