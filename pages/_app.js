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
