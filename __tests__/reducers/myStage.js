import myStage from '../../src/reducers/myStage';
import { REQUESTS } from '../../src/actions/api';

const test = (type) => {
  const stageId = 5;

  const state = myStage({}, {
    type: type,
    results: {
      findAll: (type) => {
        return type === 'user' ? [ { pathway_stage_id: stageId } ] : undefined;
      },
    },
  });

  expect(state.stageId).toEqual(stageId);
};

describe('update me success', () => {
  it('should set self stage', () => {
    test(REQUESTS.UPDATE_MY_USER.SUCCESS);
  });
});

describe('get me success', () => {
  it('should set self stage', () => {
    test(REQUESTS.GET_ME.SUCCESS);
  });
});
