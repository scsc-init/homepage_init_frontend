'use client';

import { useEffect } from 'react';
import mixpanel from '@/util/mixpanel';
import { minExecutiveLevel } from '@/util/constants';

/**
 * @param {object} user
 * @param {string} eventName
 */
export default function TrackClient({ user, eventName = 'Page Viewed' }) {
  useEffect(() => {
    if (user?.email) {
      mixpanel.identify(user.email);
      mixpanel.people.set({
        $email: user.email,
        $name: user.name,
        id: user.id,
        isAdmin: (user.role || 0) >= minExecutiveLevel,
      });
    }
  }, [user?.id, user?.email, user?.name, user?.role]);

  useEffect(() => {
    mixpanel.track(eventName);
  }, [eventName]);

  return null;
}
