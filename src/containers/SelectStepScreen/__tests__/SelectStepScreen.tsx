import React from 'react';
import { FlatList } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import i18next from 'i18next';
import { useQuery } from '@apollo/react-hooks';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import {
  ANALYTICS_SECTION_TYPE,
  ANALYTICS_ASSIGNMENT_TYPE,
} from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import { STEP_SUGGESTIONS_QUERY } from '../queries';
import { StepTypeEnum } from '../../../../__generated__/globalTypes';

import SelectStepScreen from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');

const next = jest.fn(() => () => ({}));
const orgId = '4234234';
const me = { id: '89123', first_name: 'roger' };
const personId = '252342354234';
const state = {
  auth: { person: me },
  onboarding: { currentlyOnboarding: false },
};

let screen: ReturnType<typeof renderWithContext>;
let enableSkipButton = false;

beforeEach(() => {
  screen = renderWithContext(<SelectStepScreen next={next} />, {
    initialState: state,
    navParams: { personId, orgId, enableSkipButton },
  });
});

describe('loading', () => {
  it('should render correctly', () => {
    screen.snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('add step', {
      screenContext: {
        [ANALYTICS_SECTION_TYPE]: '',
        [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
      },
    });
  });

  describe('skip button', () => {
    beforeAll(() => {
      enableSkipButton = true;
    });

    it('should render skip button correctly', () => {
      screen.snapshot();

      expect(useAnalytics).toHaveBeenCalledWith('add step', {
        screenContext: {
          [ANALYTICS_SECTION_TYPE]: '',
          [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
        },
      });
    });

    it('should call next when pressed', () => {
      fireEvent.press(screen.getByTestId('skipButton'));

      expect(next).toHaveBeenCalledWith({
        personId,
        stepSuggestionId: undefined,
        stepType: undefined,
        skip: true,
        orgId,
      });
    });
  });

  it('should hide tabs when locale is not en', () => {
    screen.recordSnapshot();
    i18next.language = 'es-419';
    screen.rerender(<SelectStepScreen next={next} />);
    screen.diffSnapshot();

    expect(useAnalytics).toHaveBeenCalledWith('add step', {
      screenContext: {
        [ANALYTICS_SECTION_TYPE]: '',
        [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
      },
    });

    i18next.language = 'en-TEST';
  });
});

describe('in onboarding', () => {
  it('renders correctly', () => {
    renderWithContext(<SelectStepScreen next={next} />, {
      initialState: { ...state, onboarding: { currentlyOnboarding: true } },
      navParams: { personId, orgId, enableSkipButton },
    }).snapshot();

    expect(useAnalytics).toHaveBeenCalledWith('add step', {
      screenContext: {
        [ANALYTICS_SECTION_TYPE]: 'onboarding',
        [ANALYTICS_ASSIGNMENT_TYPE]: 'contact',
      },
    });
  });
});

describe('with explainer open', () => {
  beforeAll(() => {
    enableSkipButton = false;
  });
  it('opens explainer modal', () => {
    fireEvent.press(screen.getByTestId('SelectStepExplainerIconButton'));
    screen.snapshot();
  });
});

it('should load step suggestions', async () => {
  const { recordSnapshot, diffSnapshot } = renderWithContext(
    <SelectStepScreen next={next} />,
    {
      initialState: state,
      navParams: { personId, orgId, enableSkipButton },
    },
  );
  recordSnapshot();
  await flushMicrotasksQueue();
  diffSnapshot();

  expect(useQuery).toHaveBeenCalledWith(STEP_SUGGESTIONS_QUERY, {
    variables: {
      personId,
      stepType: StepTypeEnum.relate,
      seed: expect.any(Number),
    },
  });
});

it('should paginate', async () => {
  const { recordSnapshot, diffSnapshot, getByType } = renderWithContext(
    <SelectStepScreen next={next} />,
    {
      initialState: state,
      navParams: { personId, orgId, enableSkipButton },
      mocks: {
        Query: () => ({
          person: () => ({
            stepSuggestions: () => ({
              pageInfo: () => ({ hasNextPage: true }),
            }),
          }),
        }),
      },
    },
  );

  await flushMicrotasksQueue();

  recordSnapshot();

  fireEvent(getByType(FlatList), 'onEndReached');

  await flushMicrotasksQueue();
  diffSnapshot();
});
