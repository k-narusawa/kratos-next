import Button from '@/src/components/ui/Button'
import DefaultHR from '@/src/components/ui/DefaultHR'
import TextInput from '@/src/components/ui/TextInput'
import Image from 'next/image'
import React, { FormEventHandler } from 'react'

interface LoginFormProps {
  handleSubmit: FormEventHandler<HTMLFormElement>
}

const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center w-full">
        <Image src="/login_image.png" width={100} height={100} alt="Mythos_Auth" />
      </div>
      <h5
        className='
          text-2xl font-semibold text-center 
          text-gray-900 dark:text-white
          mb-10 mt-5
        '
      >
        ログイン
      </h5>
      <div className='mb-2'>
        <TextInput
          label='メールアドレス'
          type='email'
          id='identifier'
          name='identifier'
          required
          placeholder='メールアドレス'
          className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
        />
      </div>
      <div className='mb-2'>
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
      <div className='flex flex-col items-center'>
        <Button
          type='submit'
          className='px-4 py-2 mt-5 w-8/12'
        >
          ログイン
        </Button>
        <Button
          type='button'
          variant='secondary'
          className='px-4 py-2 mt-10 w-8/12'
        >
          会員登録
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
