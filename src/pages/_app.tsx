import Header from '@/src/components/base/Header'
import Spinner from '@/src/components/ui/Spinner'
import useSession from '@/src/hooks/useSession'
import '@/src/styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next';

const App = ({ Component, pageProps }: AppProps) => {
  const { session, isLoading } = useSession()

  if (isLoading) {
    return <Spinner />
  }

  if (!session) {
    return (
      <div className='bg-gray-50 dark:bg-gray-900'>
        <Component {...pageProps} />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className='bg-gray-50 dark:bg-gray-900'>
        <Component {...pageProps} />
      </div>
    </>
  )
}


export default appWithTranslation(App)