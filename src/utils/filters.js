import moment from 'moment';

export const unassignedFilter = (t, selected) => ({
  id: 'unassigned',
  text: t('searchFilter:unassigned'),
  selected,
});
export const thirtyDaysFilter = t => ({
  id: 'time30',
  value: 30,
  text: t('searchFilter:time30'),
});

export const getFilterOptions = (t, filters, questions = [], labels = []) => {
  const choiceQuestions = questions.filter(
    q => q._type === 'choice_field' && q.content,
  );
  const questionFilters = Object.keys(filters)
    .map(f => filters[f])
    .filter(f => f && f.isAnswer);

  return {
    questions: {
      id: 'questions',
      text: t('searchFilter:surveyQuestions'),
      options: choiceQuestions.map(q => {
        const filterForQuestion = questionFilters.find(f => f.id === q.id);
        return {
          id: q.id,
          text: q.label,
          options: q.content
            .split(/\r*\n/)
            .filter(o => o !== '')
            .map(o => ({ id: o, text: o })),
          preview: filterForQuestion ? filterForQuestion.text : undefined,
        };
      }),
      preview:
        questionFilters.length > 0
          ? questionFilters.length === 1
            ? questionFilters[0].text
            : t('searchFilters:multiple')
          : undefined,
    },
    labels: {
      id: 'labels',
      text: t('searchFilter:label'),
      options: labels.map(l => ({ id: l.id, text: l.name })),
      preview: filters.labels ? filters.labels.text : undefined,
    },
    gender: {
      id: 'gender',
      text: t('searchFilter:gender'),
      options: [
        { id: 'm', text: t('searchFilter:male') },
        { id: 'f', text: t('searchFilter:female') },
        { id: 'o', text: t('searchFilter:other') },
      ],
      preview: filters.gender ? filters.gender.text : undefined,
    },
    time: {
      id: 'time',
      text: t('searchFilter:time'),
      options: [
        { id: 'time7', value: 7, text: t('searchFilter:time7') },
        thirtyDaysFilter(t),
        { id: 'time60', value: 60, text: t('searchFilter:time60') },
        { id: 'time90', value: 90, text: t('searchFilter:time90') },
        { id: 'time180', value: 180, text: t('searchFilter:time180') },
        { id: 'time270', value: 270, text: t('searchFilter:time270') },
        { id: 'time365', value: 365, text: t('searchFilter:time365') },
      ],
      preview: filters.time ? filters.time.text : undefined,
    },
    uncontacted: {
      id: 'uncontacted',
      text: t('searchFilter:uncontacted'),
      selected: !!filters.uncontacted,
    },
    unassigned: unassignedFilter(t, !!filters.unassigned),
    archived: {
      id: 'archived',
      text: t('searchFilter:archived'),
      selected: !!filters.archived,
    },
  };
};

export const searchHandleToggle = (scope, item) => {
  const { toggleOptions, filters } = scope.state;
  if (!item) {
    return;
  }
  const newFilters = { ...filters };
  const field = item.id;
  const newValue = !item.selected;
  newFilters[field] = newValue ? { ...item, selected: true } : undefined;
  const newToggleOptions = toggleOptions.map(o => ({
    ...o,
    selected: o.id === item.id ? newValue : o.selected,
  }));
  scope.setState({ toggleOptions: newToggleOptions, filters: newFilters });
  scope.props.onFilter(newFilters);
};

export const searchSelectFilter = (scope, item) => {
  const { options, selectedFilterId, filters } = scope.state;
  const newOptions = options.map(o => ({
    ...o,
    preview: o.id === selectedFilterId ? item.text : o.preview,
  }));
  const newFilters = {
    ...filters,
    [selectedFilterId]: item,
  };
  if (item.id === 'any') {
    delete newFilters[selectedFilterId];
  }
  scope.setState({ options: newOptions, filters: newFilters });
  if (scope.props.onFilter) {
    scope.props.onFilter(newFilters);
  }
};

export const searchRemoveFilter = async (
  scope,
  key,
  defaultFilterKeys = [],
) => {
  const newFilters = { ...scope.state.filters };
  delete newFilters[key];
  const newState = { filters: newFilters };
  // If one of the default filters is removed, remove the default contacts to show
  if (defaultFilterKeys.includes(key)) {
    newState.defaultResults = [];
  }
  return await new Promise(resolve =>
    scope.setState(newState, () => resolve()),
  );
};

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss[Z]';
export function timeFilter(numOfDays) {
  const first = moment()
    .subtract(numOfDays, 'days')
    .hour(0)
    .minute(0)
    .second(0)
    .format(DATE_FORMAT);
  const last = moment()
    .hour(23)
    .minute(59)
    .second(59)
    .format(DATE_FORMAT);
  return {
    first,
    last,
  };
}
