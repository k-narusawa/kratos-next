import Card from '@/src/components/ui/Card'
import DefaultHR from '@/src/components/ui/DefaultHR'
import Link from 'next/link'
import VerifiedIcon from '@mui/icons-material/Verified'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported'
import { useTranslation } from 'next-i18next'

interface ErrorProps {
  errorMessage: string | undefined
}

const Error: React.FC<ErrorProps> = ({ errorMessage: errorMessage }) => {
  const { t } = useTranslation('common')

  return (
    <>
      <Card>
        <h5 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
          {t('error.title')}
        </h5>
      </Card>
    </>
  )
}

export default Error
