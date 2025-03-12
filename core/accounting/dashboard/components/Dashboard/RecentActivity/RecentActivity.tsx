import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { Log } from '@/core/logs/interfaces';
import { Card } from '@/components/ui/Card/Card';
import { SimpleCardHeader } from '@/components/ui/Card/SimpleCardHeader';
import { SimpleCardHeaderTitle } from '@/components/ui/Card/SimpleCardHeaderTitle';
import { ActivityList } from './ActivityList';
import { theme } from '@/components/ui/theme';

interface RecentActivityProps {
  activities: Log[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card>
      <SimpleCardHeader>
        <Ionicons name={'flash-outline'} size={20} color={theme.foreground} />
        <SimpleCardHeaderTitle>Recent Activity</SimpleCardHeaderTitle>
      </SimpleCardHeader>
      <ActivityList activities={activities} />
    </Card>
  );
};
