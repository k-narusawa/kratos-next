import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import { OAuth2ConsentRequest } from '@ory/client'
import React, { FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

interface ConsentFormProps {
  handleAccept: FormEventHandler<HTMLFormElement>
  consentRequest: OAuth2ConsentRequest
}

const ConsentForm: React.FC<ConsentFormProps> = ({
  handleAccept: handleAccept,
  consentRequest: consentRequest,
}) => {
  const { t } = useTranslation('common')

  return (
    <Card>
      <form onSubmit={handleAccept}>
        <h5
          className='
            text-2xl font-semibold text-center 
            text-gray-900 dark:text-white
            mb-10 mt-5
          '
        >
          {t('consent.title')}
        </h5>
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <tbody>
              {consentRequest.requested_scope?.map((scope, index) => (
                <tr
                  key={index}
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  <td className='w-4 p-4'>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <label className='sr-only'>checkbox</label>
                    </div>
                  </td>
                  <th
                    scope='row'
                    className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    <div className='ps-3'>
                      <div className='text-base font-semibold'>
                        {t(`ory.consent.scope.${scope}`)}
                      </div>
                      <div className='font-normal text-gray-500'>
                        {t(`ory.consent.detail.${scope}`)}
                      </div>
                    </div>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex flex-col items-center'>
          <Button type='submit' className='px-4 py-2 mt-5 w-8/12'>
            {t('consent.accept')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ConsentForm
