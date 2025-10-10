import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/react';
import { Replay } from '@sentry/replay';

const dsn = process.env.REACT_APP_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: [
          /^https?:\/\/localhost:8000/,
          /^\//
        ],
      }),
      new Replay(),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export default Sentry;
