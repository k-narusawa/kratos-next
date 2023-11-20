import Button from "@/src/components/Button";
import TextInput from "@/src/components/TextInput";
import React, { FormEventHandler } from 'react';

interface LoginFormProps {
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

const LoginForm: React.FC<LoginFormProps> = ({handleSubmit}) => {
  return (
    <form onSubmit={handleSubmit}>
      <h5 className="
        text-2xl font-semibold text-center 
        text-gray-900 dark:text-white
      ">ログイン</h5>
      <div className="mb-2">
        <TextInput
          label="メールアドレス"
          type="email"
          id="identifier"
          name="identifier"
          required
          placeholder="メールアドレス"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="mb-2">
        <TextInput
          label="パスワード"
          type="password"
          id="password"
          name="password"
          required
          placeholder="パスワード"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <Button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">ログイン</Button>
    </form>
  );
};

export default LoginForm;