import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import { UiText } from '@ory/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

interface LoginFormProps {
  handleLogin: FormEventHandler<HTMLFormElement>
  errorMessages: UiText[]
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleLogin: handleSubmit,
  errorMessages,
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className='flex justify-center w-full'>
          <Image src='/logo.svg' width={100} height={100} alt='Mythos_Auth' />
        </div>
        <h5
          className='
            text-2xl font-semibold text-center 
            text-gray-900 dark:text-white
            mb-10 mt-5
          '
        >
          {t('login.title')}
        </h5>
        <div className='mb-5'>
          <TextInput
            label={t('login.email')}
            type='email'
            id='identifier'
            name='identifier'
            required
            className='w-full mb-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='mb-2'>
          <TextInput
            label={t('login.password')}
            type='password'
            id='password'
            name='password'
            required
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        {errorMessages &&
          errorMessages.map((errorMessage, index) => (
            <div key={index} className='text-red-500 text-center'>
              {/* FIXME: ここフォールバックできるようにしたい */}
              {t(`ory.error_message.${errorMessage.id}`)}
            </div>
          ))}
        <div className='flex flex-col items-center'>
          <Button type='submit' className='px-4 py-2 mt-5 w-8/12'>
            {t('login.login')}
          </Button>
          <Button
            type='button'
            variant='secondary'
            className='px-4 py-2 mt-10 w-8/12'
            onClick={() => router.push('/registration')}
          >
            {t('login.register')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default LoginForm
