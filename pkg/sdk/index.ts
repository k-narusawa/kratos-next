import { Configuration, FrontendApi, OAuth2Api } from '@ory/client'

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
export const ory = new FrontendApi(new Configuration(localConfig))
export const oauth = new OAuth2Api(new Configuration(localConfig))
