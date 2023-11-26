import Button from '@/src/components/ui/Button'
import Card from '@/src/components/ui/Card'
import TextInput from '@/src/components/ui/TextInput'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FormEventHandler } from 'react'

interface LoginFormProps {
  handleLogin: FormEventHandler<HTMLFormElement>  
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleLogin: handleSubmit,
}) => {
  const router = useRouter()
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
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
          ログイン
        </h5>
        <div className='mb-5'>
          <TextInput
            label='メールアドレス'
            type='email'
            id='identifier'
            name='identifier'
            required
            className='w-full mb-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='mb-2'>
          <TextInput
            label='パスワード'
            type='password'
            id='password'
            name='password'
            required
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white'
          />
        </div>
        <div className='flex flex-col items-center'>
          <Button type='submit' className='px-4 py-2 mt-5 w-8/12'>
            ログイン
          </Button>
          <Button
            type='button'
            variant='secondary'
            className='px-4 py-2 mt-10 w-8/12'
            onClick={() => router.push('/registration')}
          >
            会員登録
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default LoginForm
