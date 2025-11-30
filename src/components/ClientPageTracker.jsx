'use client';

import { useEffect, useState } from 'react';
import { fetchMeClient } from '@/util/fetchClientData';
import TrackClient from '@/components/MixPanel';

export default function ClientPageTracker({ eventName }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetchMeClient().then(setUser);
  }, []);

  return <TrackClient user={user} eventName={eventName} />;
}
