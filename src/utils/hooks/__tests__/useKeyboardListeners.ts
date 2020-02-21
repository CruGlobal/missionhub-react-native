import { Keyboard } from 'react-native';
import { renderHook } from '@testing-library/react-hooks';

import { useKeyboardListeners } from '../useKeyboardListeners';

const events: { [key: string]: () => void } = {};

Keyboard.addListener = ((eventName: string, listener: () => void) => {
  events[eventName] = listener;
  return { remove: jest.fn() };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

const fireEvent = (eventName: string) => events[eventName]();

const onShow = jest.fn();
const onHide = jest.fn();

describe('useKeyboardListeners', () => {
  beforeEach(() => {
    renderHook(() => useKeyboardListeners({ onShow, onHide }));

    expect(onShow).not.toHaveBeenCalled();
    expect(onHide).not.toHaveBeenCalled();
  });
  it('should call onShow callback when keyboard opens', () => {
    fireEvent('keyboardWillShow');

    expect(onShow).toHaveBeenCalled();
    expect(onHide).not.toHaveBeenCalled();
  });
  it('should call onHide callback when keyboard closes', () => {
    fireEvent('keyboardWillHide');

    expect(onShow).not.toHaveBeenCalled();
    expect(onHide).toHaveBeenCalled();
  });
});
