import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import i18next from 'i18next';

import { renderWithContext } from '../../../../testUtils';
import { StepTypeEnum } from '../../../../__generated__/globalTypes';

import SelectStepExplainerModal, { AddStepExplainer } from '..';

jest.mock('react-native-snap-carousel', () => ({
  ...jest.requireActual('react-native-snap-carousel'),
  __esModule: true,
  Pagination: 'Pagination',
}));

const onClose = jest.fn();

let screen: ReturnType<typeof renderWithContext>;

beforeEach(() => {
  screen = renderWithContext(<SelectStepExplainerModal onClose={onClose} />);
});

describe('renders correctly', () => {
  it('renders correctly', () => {
    screen.snapshot();
  });
});

describe('presses buttons', () => {
  it('presses close button', () => {
    fireEvent.press(screen.getByTestId('SelectStepExplainerCloseButton'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('explainer data', () => {
  it('part 1', () => {
    expect(AddStepExplainer[0]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part1'),
    });
  });
  it('part 2', () => {
    expect(AddStepExplainer[1]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part2'),
      stepType: StepTypeEnum.relate,
    });
  });
  it('part 3', () => {
    expect(AddStepExplainer[2]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part3'),
      stepType: StepTypeEnum.pray,
    });
  });
  it('part 4', () => {
    expect(AddStepExplainer[3]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part4'),
      stepType: StepTypeEnum.care,
    });
  });
  it('part 5', () => {
    expect(AddStepExplainer[4]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part5'),
      stepType: StepTypeEnum.share,
    });
  });
});
