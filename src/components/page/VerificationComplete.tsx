import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import React, { FormEventHandler } from 'react'
import { useTranslation } from 'next-i18next'

const VerificationComplete: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <Card>
      <h5
        className='
          text-2xl font-semibold text-center 
          text-gray-900 dark:text-white
          mb-10 mt-5
        '
      >
        {t('verification.title')}
      </h5>
      <p
        className='
          text-2xl font-semibold text-center 
          text-gray-900 dark:text-white
          mb-10 mt-5
        '
      >
        {t('verification.complete')}
      </p>
    </Card>
  )
}

export default VerificationComplete
