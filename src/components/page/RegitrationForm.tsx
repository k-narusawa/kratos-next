import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import React, { FormEventHandler } from 'react'

interface RegistrationFormProps {
  handleRegistration: FormEventHandler<HTMLFormElement>
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  handleRegistration: handleRegistration,
}) => {
  const { t } = useTranslation('common')

  return (
    <Card>
      <form onSubmit={handleRegistration}>
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
          {t('registration.title')}
        </h5>
        <div className='mb-5'>
          <TextInput
            label={t('registration.email')}
            type='email'
            id='traits.email'
            name='traits.email'
            required
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='mb-2'>
          <TextInput
            label={t('registration.password')}
            type='password'
            id='password'
            name='password'
            required
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='flex flex-col items-center'>
          <Button type='submit' className='px-4 py-2 mt-5 w-8/12'>
            {t('registration.register')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default RegistrationForm
