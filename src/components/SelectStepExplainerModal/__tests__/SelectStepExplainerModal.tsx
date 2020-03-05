import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import SelectStepExplainerModal, { getExplainerData } from '..';

const onClose = jest.fn();

let screen: ReturnType<typeof renderWithContext>;
const mockText = 'test';

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
  const t = jest.fn().mockReturnValue(mockText);
  it('part 1', () => {
    expect(getExplainerData(0, t)).toEqual({
      source: expect.anything(),
      text: mockText,
    });
    expect(t).toHaveBeenCalledWith('selectStepExplainer:part1');
  });
  it('part 2', () => {
    expect(getExplainerData(1, t)).toEqual({
      source: expect.anything(),
      text: mockText,
      icon: 'filterIcon',
      title: mockText,
    });
    expect(t).toHaveBeenCalledWith('selectStepExplainer:part2');
    expect(t).toHaveBeenCalledWith('stepTypes:relate');
  });
  it('part 3', () => {
    expect(getExplainerData(2, t)).toEqual({
      source: expect.anything(),
      text: mockText,
      icon: 'filterIcon',
      title: mockText,
    });
    expect(t).toHaveBeenCalledWith('selectStepExplainer:part3');
    expect(t).toHaveBeenCalledWith('stepTypes:pray');
  });
  it('part 4', () => {
    expect(getExplainerData(3, t)).toEqual({
      source: expect.anything(),
      text: mockText,
      icon: 'filterIcon',
      title: mockText,
    });
    expect(t).toHaveBeenCalledWith('selectStepExplainer:part4');
    expect(t).toHaveBeenCalledWith('stepTypes:care');
  });
  it('part 5', () => {
    expect(getExplainerData(4, t)).toEqual({
      source: expect.anything(),
      text: mockText,
      icon: 'filterIcon',
      title: mockText,
    });
    expect(t).toHaveBeenCalledWith('selectStepExplainer:part5');
    expect(t).toHaveBeenCalledWith('stepTypes:share');
  });
});
