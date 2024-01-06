import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import React, { FormEventHandler } from 'react'
import { useTranslation } from 'next-i18next'

interface VerificationEmailFormProps {
  handleSubmit: FormEventHandler<HTMLFormElement>
}

const VerificationEmailForm: React.FC<VerificationEmailFormProps> = ({
  handleSubmit: handleSubmit,
}) => {
  const { t } = useTranslation('common')

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h5
          className='
            text-2xl font-semibold text-center 
            text-gray-900 dark:text-white
            mb-10 mt-5
          '
        >
          {t('verification.title')}
        </h5>
        <div className='mb-5'>
          <TextInput
            label={t('verification.code')}
            type='text'
            id='code'
            name='code'
            required
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='flex flex-col items-center'>
          <Button type='submit' className='px-4 py-2 mt-5 w-8/12'>
            {t('verification.verify')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default VerificationEmailForm
