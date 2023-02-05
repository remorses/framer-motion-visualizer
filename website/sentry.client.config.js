// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: 'https://559f09ce0bde43bb921a66ca543b5c41@o4504578358771712.ingest.sentry.io/4504578359754752',

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    onFatalError: onUncaughtException,
    beforeSend(event) {
        // do not send in development
        if (process.env.NODE_ENV === 'development') {
            return null
        }
        return event
    },

    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
})

// https://github.com/nodejs/node/issues/42154
function onUncaughtException(error) {
    if (error?.['code'] === 'ECONNRESET') {
        console.log(`handled uncaughtException ${error}`)
        return
    }
    console.error('UNCAUGHT EXCEPTION')
    console.error(error)

    process.exit(1)
}
