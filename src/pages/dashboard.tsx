import ory from "../../pkg/sdk"
import { useEffect, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { LogoutLink } from "@/src/components/LogoutLink";
import { Session } from "@ory/client";
import Button from "@/src/components/Button";

const DashboardPage = () => {
  const [session, setSession] = useState<Session|undefined>(undefined)
  const [hasSession, setHasSession] = useState<boolean>(false)

  const onLogout = LogoutLink()
  const router = useRouter()

  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        setSession(data)
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
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 py-2 m-2 text-center bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">ユーザー情報</h2>
          <p className="mt-2 text-lg">Email: {session.identity?.traits.email}</p>
          <p className="mt-2 text-lg">ID: {session.identity?.id}</p>
          <p className="mt-2 text-lg">認証日時: {session.authenticated_at}</p>
        </div>
        <div className="w-full px-4 py-2 m-2 text-center bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">デバイス情報</h2>
          {session.devices?.map((device, index) => (
            <div key={index}>
              <p className="mt-2 text-lg">IPアドレス: {device.ip_address}</p>
              <p className="mt-2 text-lg">ユーザーエージェント: {device.user_agent}</p>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={onLogout}>ログアウト</Button>
    </div>
  );
  }

  return (
    <>
      <Link href="/login" passHref>ログイン</Link><br/>
      <Link href="/registration" passHref>登録</Link>
    </>
  )
}

export default DashboardPage;