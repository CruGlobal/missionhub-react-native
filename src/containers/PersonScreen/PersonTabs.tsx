import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// eslint-disable-next-line import/named
import { NavigationProp, NavigationState } from 'react-navigation';
import i18next from 'i18next';

import {
  CollapsibleViewProvider,
  createCollapsibleViewContext,
} from '../../components/CollapsibleView/CollapsibleView';
import { PersonHeader } from '../../components/PersonHeader/PersonHeader';
import { ImpactTab, IMPACT_TAB } from '../ImpactTab/ImpactTab';
import { HeaderTabs } from '../../components/HeaderTabBar/HeaderTabBar';

import { PersonSteps, PERSON_STEPS } from './PersonSteps';
import { PersonNotes, PERSON_NOTES } from './PersonNotes';
import { PersonJourney, PERSON_JOURNEY } from './PersonJourney';

const PersonCollapsibleHeaderContext = createCollapsibleViewContext();

const personTabs = ({ isMe }: { isMe: boolean }) => [
  {
    name: i18next.t('personTabs:steps'),
    navigationAction: PERSON_STEPS,
    component: () => (
      <PersonSteps collapsibleHeaderContext={PersonCollapsibleHeaderContext} />
    ),
  },
  {
    name: i18next.t('personTabs:notes'),
    navigationAction: PERSON_NOTES,
    component: () => (
      <PersonNotes collapsibleHeaderContext={PersonCollapsibleHeaderContext} />
    ),
  },
  {
    name: i18next.t('personTabs:journey'),
    navigationAction: PERSON_JOURNEY,
    component: () => (
      <PersonJourney
        collapsibleHeaderContext={PersonCollapsibleHeaderContext}
      />
    ),
  },
  ...(isMe
    ? [
        {
          name: i18next.t('personTabs:impact'),
          navigationAction: IMPACT_TAB,
          component: () => (
            <ImpactTab
              collapsibleHeaderContext={PersonCollapsibleHeaderContext}
            />
          ),
        },
      ]
    : []),
];

type TabsConfig = (HeaderTabs[0] & { component: unknown })[];

const createPersonTabsNavigator = (tabs: TabsConfig) =>
  createMaterialTopTabNavigator(
    tabs.reduce(
      (acc, tab) => ({
        ...acc,
        [tab.navigationAction]: tab.component,
      }),
      {},
    ),
    {
      backBehavior: 'none',
      lazy: true,
      tabBarComponent: () => (
        <PersonHeader
          tabs={tabs}
          collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        />
      ),
    },
  );

const createPersonTabs = (tabs: TabsConfig) => {
  const PersonTabsNavigator = createPersonTabsNavigator(tabs);

  const PersonTabsRouter = ({
    navigation,
  }: {
    navigation: NavigationProp<NavigationState>;
  }) => (
    <CollapsibleViewProvider context={PersonCollapsibleHeaderContext}>
      <PersonTabsNavigator navigation={navigation} />
    </CollapsibleViewProvider>
  );
  PersonTabsRouter.router = PersonTabsNavigator.router;
  return PersonTabsRouter;
};

export const ME_PERSON_TABS = 'nav/ME_PERSON_TABS';
export const PERSON_TABS = 'nav/PERSON_TABS';

export const PersonTabs = {
  [ME_PERSON_TABS]: createPersonTabs(personTabs({ isMe: true })),
  [PERSON_TABS]: createPersonTabs(personTabs({ isMe: false })),
};
