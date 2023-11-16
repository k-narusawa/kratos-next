import ory from "../../pkg/sdk"
import { useEffect, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LogoutLink } from "@/src/components/LogoutLink";

const DashboardPage = () => {
  const [session, setSession] = useState<string>(
    "No valid Ory Session was found.\nPlease sign in to receive one.",
  )
  const [hasSession, setHasSession] = useState<boolean>(false)

  const onLogout = LogoutLink()
  const router = useRouter()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(JSON.stringify(data, null, 2))
        setHasSession(true)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return router.push("/login?aal=aal2")
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
  }, [router])

  if(session){
    return (
      <>
        <pre>{session}</pre>
        <button onClick={onLogout}>Logout</button>
      </>
    )
  }

  return (
    <>
      <Link href="/login" passHref>ログイン</Link><br/>
      <Link href="/registration" passHref>登録</Link>
    </>
  )
}

export default DashboardPage;