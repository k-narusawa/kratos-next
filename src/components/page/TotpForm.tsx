import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FormEventHandler } from 'react'

interface TotpFormProps {
  handleLogin: FormEventHandler<HTMLFormElement>
}

const TotpForm: React.FC<TotpFormProps> = ({ handleLogin: handleSubmit }) => {
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {/* <div className='flex justify-center w-full'>
          <Image src='/logo.svg' width={100} height={100} alt='Mythos_Auth' />
        </div> */}
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
