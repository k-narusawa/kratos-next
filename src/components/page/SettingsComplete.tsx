import Card from '@/src/components/ui/Card'
import React from 'react'
import { useTranslation } from 'next-i18next'

const SettingsComplete: React.FC = () => {
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
        {t('settings.title')}
      </h5>
      <p
        className='
          text-2xl font-semibold text-center 
          text-gray-900 dark:text-white
          mb-10 mt-5
        '
      >
        {t('settings.complete')}
      </p>
    </Card>
  )
}

export default SettingsComplete
