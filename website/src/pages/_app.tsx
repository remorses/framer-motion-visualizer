
import 'baby-i-am-faded/styles.css'
import '@app/styles/index.css'
import '@tremor/react/dist/esm/tremor.css'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import NextNprogress from 'nextjs-progressbar'

import { BeskarProvider } from 'beskar/src/BeskarProvider'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const router = useRouter()

    return (
        <SessionProvider session={session}>
            {/* <Script async src='https://cdn.splitbee.io/sb.js'></Script> */}

            <BeskarProvider>
                <ThemeProvider
                    defaultTheme='light'
                    enableSystem={false}
                    attribute='class'
                    // forcedTheme={forcedTheme}
                >
                    <Toaster
                        containerStyle={{ zIndex: 10000 }}
                        position='top-center'
                    />

                    <NextNprogress
                        color='#29D'
                        startPosition={0.3}
                        stopDelayMs={200}
                        height={4}
                        options={{ showSpinner: false }}
                        showOnShallow={true}
                    />

                    <Component {...pageProps} />
                </ThemeProvider>
            </BeskarProvider>
        </SessionProvider>
    )
}
export default MyApp
