import Header from '@/src/components/base/Header'
import '@/src/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <div className='bg-gray-50 dark:bg-gray-900'>
        <Component {...pageProps} />
      </div>
    </>
  )
}
