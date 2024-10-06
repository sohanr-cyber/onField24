import '@/styles/globals.css'
import NextNProgress from 'nextjs-progressbar'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import BASE_URL from '@/config'
import { SnackbarProvider } from 'notistack'
import { DefaultSeo, NextSeo } from 'next-seo'
import { getSeoData } from '@/utility/const'
import Script from 'next/script'

export default function App ({ Component, pageProps }) {
  const router = useRouter()
  const lang = router.locale
  console.log({ locale: lang })

  return (
    <>
      <link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png' />
      <link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png' />
      <link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png' />
      <link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png' />
      <link
        rel='apple-touch-icon'
        sizes='114x114'
        href='/apple-icon-114x114.png'
      />
      <link
        rel='apple-touch-icon'
        sizes='120x120'
        href='/apple-icon-120x120.png'
      />
      <link
        rel='apple-touch-icon'
        sizes='144x144'
        href='/apple-icon-144x144.png'
      />
      <link
        rel='apple-touch-icon'
        sizes='152x152'
        href='/apple-icon-152x152.png'
      />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-icon-180x180.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='192x192'
        href='/android-icon-192x192.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='96x96'
        href='/favicon-96x96.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon-16x16.png'
      />
      <link rel='manifest' href='/manifest.json' />
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
      <meta name='theme-color' content='#ffffff'></meta>
      <DefaultSeo {...getSeoData(lang)} />
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-V1J9SKGV3W'
      ></Script>
      <Script id='clarity-script' strategy='afterInteractive'>
        {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "obbo56mrps");`}
      </Script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-V1J9SKGV3W');
              `
        }}
      />
      <script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6701405762080594'
        crossorigin='anonymous'
      ></script>

      <Provider store={store}>
        <SnackbarProvider>
          <Layout>
            <>
              <NextNProgress />
              <Component {...pageProps} />
            </>
          </Layout>{' '}
        </SnackbarProvider>
      </Provider>
    </>
  )
}
