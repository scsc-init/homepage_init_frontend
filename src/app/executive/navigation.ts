export type ExecutiveNavItem = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

export type ExecutiveNavGroup = {
  title: string;
  items: ExecutiveNavItem[];
};

export const EXECUTIVE_NAV_GROUPS: ExecutiveNavGroup[] = [
  {
    title: 'dashboard',
    items: [
      {
        title: 'adminHome',
        description: 'adminHomeDescription',
        href: '/executive',
      },
    ],
  },
  {
    title: 'members',
    items: [
      {
        title: 'memberManagement',
        description: 'memberManagementDescription',
        href: '/executive/user',
      },
      {
        title: 'activityLogs',
        description: 'activityLogsDescription',
        href: '/executive/user/activity-logs',
      },
      {
        title: 'leadershipManagement',
        description: 'leadershipManagementDescription',
        href: '/executive/user/leadership',
      },
    ],
  },
  {
    title: 'contentGroup',
    items: [
      {
        title: 'articleManagement',
        description: 'articleManagementDescription',
        href: '/executive/board',
      },
      {
        title: 'fundingBoard',
        description: 'fundingBoardDescription',
        href: '/board/6',
        external: true,
      },
      {
        title: 'htmlManagement',
        description: 'htmlManagementDescription',
        href: '/executive/w',
      },
      {
        title: 'kvNavigation',
        description: 'kvDescription',
        href: '/executive/kv',
      },
    ],
  },
  {
    title: 'groups',
    items: [
      {
        title: 'sigManagement',
        description: 'sigManagementDescription',
        href: '/executive/sig',
      },
      {
        title: 'smallGroupManagement',
        description: 'smallGroupManagementDescription',
        href: '/executive/small-group',
      },
      {
        title: 'pigManagement',
        description: 'pigManagementDescription',
        href: '/executive/pig',
      },
    ],
  },
  {
    title: 'referenceData',
    items: [
      {
        title: 'majorManagement',
        description: 'majorManagementDescription',
        href: '/executive/major',
      },
    ],
  },
];

export const EXECUTIVE_NAV_ITEMS: ExecutiveNavItem[] = EXECUTIVE_NAV_GROUPS.flatMap(
  (group) => group.items,
);
