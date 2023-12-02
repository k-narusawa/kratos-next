import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import { UiText } from '@ory/client'
import React, { FormEventHandler } from 'react'

interface TotpFormProps {
  handleLogin: FormEventHandler<HTMLFormElement>
  errorMessages: UiText[]
}

const TotpForm: React.FC<TotpFormProps> = ({
  handleLogin: handleSubmit,
  errorMessages,
}) => {
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
          MFA認証
        </h5>
        <div className='mb-5'>
          <TextInput
            label='認証コード'
            type='text'
            id='totp_code'
            name='totp_code'
            required
            className='w-full mb-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        {errorMessages &&
          errorMessages.map((errorMessage, index) => (
            <div key={index} className='text-red-500 text-center'>
              {errorMessage.text}
            </div>
          ))}
        <div className='flex flex-col items-center'>
          <Button type='submit' className='px-4 py-2 mt-5 w-8/12'>
            送信
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default TotpForm
