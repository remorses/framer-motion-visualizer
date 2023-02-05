// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: 'https://559f09ce0bde43bb921a66ca543b5c41@o4504578358771712.ingest.sentry.io/4504578359754752',

    tracesSampleRate: 1.0,
    // onFatalError: onUncaughtException,
    beforeSend(event) {
        // do not send in development
        if (process.env.NODE_ENV === 'development') {
            return null
        }
        return event
    },
    integrations(integrations) {
        return integrations.filter(
            (integration) => integration.id !== 'OnUncaughtException',
        )
    },
})

// https://github.com/nodejs/node/issues/42154
global.process.on('uncaughtException', (error) => {
    const hub = Sentry.getCurrentHub()
    hub.withScope(async (scope) => {
        scope.setLevel('fatal')
        hub.captureException(error, { originalException: error })
    })
    if (error?.['code'] === 'ECONNRESET') {
        console.log(`handled ECONNRESET ${error}`)
        return
    }
    console.error('UNCAUGHT EXCEPTION')
    console.error(error)
    // console.error(origin)
    process.exit(1)
})
