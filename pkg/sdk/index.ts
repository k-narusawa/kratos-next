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
export const ory = new FrontendApi(new Configuration({
  basePath: process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
  baseOptions: { withCredentials: true },
}))

export const oauth = new OAuth2Api(new Configuration({
  basePath: "http://127.0.0.1:4445",
  baseOptions: { withCredentials: true },
}))
