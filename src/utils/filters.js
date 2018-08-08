export const getFilterOptions = (t, filters, questions = [], labels = []) => {
  const choiceQuestions = questions.filter(
    q => q._type === 'choice_field' && q.content,
  );

  return {
    questions: {
      id: 'questions',
      text: t('searchFilter:surveyQuestions'),
      options: choiceQuestions.map(q => ({
        id: q.id,
        text: q.label,
        options: q.content
          .split(/\r*\n/)
          .filter(o => o !== '')
          .map(o => ({ id: o, text: o })),
      })),
      preview: filters.questions ? filters.questions.text : undefined,
    },
    label: {
      id: 'label',
      text: t('searchFilter:label'),
      options: labels.map(l => ({ id: l.id, text: l.name })),
      preview: filters.label ? filters.label.text : undefined,
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
        { id: 'time7', text: t('searchFilter:time7') },
        { id: 'time30', text: t('searchFilter:time30') },
        { id: 'time60', text: t('searchFilter:time60') },
        { id: 'time90', text: t('searchFilter:time90') },
        { id: 'time180', text: t('searchFilter:time180') },
        { id: 'time270', text: t('searchFilter:time270') },
        { id: 'time365', text: t('searchFilter:time365') },
      ],
      preview: filters.time ? filters.time.text : undefined,
    },
    uncontacted: {
      id: 'uncontacted',
      text: t('searchFilter:uncontacted'),
      selected: !!filters.uncontacted,
    },
    unassigned: {
      id: 'unassigned',
      text: t('searchFilter:unassigned'),
      selected: !!filters.unassigned,
    },
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
  let newFilters = { ...filters };
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
  let newFilters = {
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
  let newFilters = { ...scope.state.filters };
  delete newFilters[key];
  let newState = { filters: newFilters };
  // If one of the default filters is removed, remove the default contacts to show
  if (defaultFilterKeys.includes(key)) {
    newState.defaultResults = [];
  }
  return await new Promise(resolve =>
    scope.setState(newState, () => resolve()),
  );
};
