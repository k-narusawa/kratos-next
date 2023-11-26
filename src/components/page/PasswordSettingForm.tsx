import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import Image from 'next/image'
import React, { FormEventHandler } from 'react'

interface PasswordSettingFormProps {
  handleChangePassword: FormEventHandler<HTMLFormElement>
}

const PasswordSettingForm: React.FC<PasswordSettingFormProps> = ({
  handleChangePassword,
}) => {
  return (
    <Card>
      <form onSubmit={handleChangePassword}>
        <h5
          className='
            text-2xl font-semibold text-center 
            text-gray-900 dark:text-white
            mb-10 mt-5
          '
        >
          パスワード変更
        </h5>
        <div className='mb-5'>
          <TextInput
            label='パスワード'
            type='password'
            id='password'
            name='password'
            required
            placeholder='パスワード'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='mb-2'>
          <TextInput
            label='パスワード(確認用)'
            type='password'
            id='password'
            name='password'
            required
            placeholder='パスワード(確認用)'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='flex flex-col items-center'>
          <Button type='submit' className='px-4 py-2 mt-5 w-8/12'>
            変更
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default PasswordSettingForm
