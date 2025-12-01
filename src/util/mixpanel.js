'use client';

import mixpanel from 'mixpanel-browser';
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN;

if (typeof window !== 'undefined' && MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
  });
}

export default mixpanel;
