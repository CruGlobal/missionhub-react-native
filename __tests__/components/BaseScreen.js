import BaseScreen from '../../src/components/BaseScreen';
import * as Analytics from '../../src/actions/analytics';

jest.mock('../../src/actions/analytics');

const mockReturnValue = 'test';

describe('componentDidMount', () => {
  beforeEach(() => {
    const func = jest.fn();
    func.mockReturnValue(mockReturnValue);

    Analytics.trackState = func;
  });

  it('should track state with constructor name', () => {
    const screen = new BaseScreen();
    screen.props = {
      dispatch: jest.fn(),
    };

    screen.componentDidMount();

    expect(Analytics.trackState).toHaveBeenCalledWith(screen.constructor.name);
    expect(screen.props.dispatch).toHaveBeenCalledWith(mockReturnValue);
  });
});
