import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  return (
    <nav className='bg-white border-gray-200 dark:bg-gray-900'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <Link
          href='/dashboard'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <Image
            width={30}
            height={20}
            src='/logo.svg'
            className='h-8'
            alt='Mythos Auth Logo'
          />
          <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
            Mythos Auth
          </span>
        </Link>
      </div>
    </nav>
  )
}

export default Header
