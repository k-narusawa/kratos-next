import { Configuration, FrontendApi } from '@ory/client'

const localConfig = {
  apiKey: undefined,
  username: undefined,
  password: undefined,
  accessToken: undefined,
  basePath: process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
  baseOptions: { withCredentials: true },
  formDataCtor: undefined,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new FrontendApi(new Configuration(localConfig))
