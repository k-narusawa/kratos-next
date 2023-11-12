import { Configuration, FrontendApi } from "@ory/client"
import { edgeConfig } from "@ory/integrations/next"

const localConfig = {
  apiKey: undefined,
  username: undefined,
  password: undefined,
  accessToken: undefined,
  basePath: process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL,
  baseOptions: { withCredentials: true },
  formDataCtor: undefined
}

export default new FrontendApi(
  new Configuration(
    process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL ? localConfig : edgeConfig,
  ),
)
