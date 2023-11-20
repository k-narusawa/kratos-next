import ory from "../../pkg/sdk"
import { FormEventHandler, useEffect, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Session, SettingsFlow } from "@ory/client";

interface qr_details{
  enabled: boolean,
  totp_qr: string,
}

const SettingsPage = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session|undefined>(undefined);
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [flow, setFlow] = useState<SettingsFlow>();

  const [qr_details, setQrDetails] = useState<qr_details|undefined>(undefined)


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
        return Promise.reject(err)
      })
    
    ory
      .createBrowserSettingsFlow()
      .then(({ data }) => {
        console.log(data)
        data.ui.nodes.filter((node) => node.group === "totp").forEach((node) => {
          console.log(node.attributes)
          if(node.attributes.id === 'totp_qr'){
            console.log(node.attributes.value)
            console.log(node.attributes)
            setQrDetails({
              enabled: false,
              totp_qr: node.attributes.src,
            })
          }
        })
      }).catch(({err}) => {
        console.log(err)
      })
  }, [router])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!flow) {
      return <div>Flow not found</div>;
    }

    const csrf_token = flow.ui.nodes.find(
      (node) => (
        node.group === "default"
        && 'name' in node.attributes
        && node.attributes.name === "csrf_token"
      ))?.attributes.value || "";

    ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          csrf_token: csrf_token,
          method: "totp",
          totp_code: "123456",
        }
      })
  }

  if(session && qr_details){
    return (
      <>
        <img src={qr_details.totp_qr} />
        <form onSubmit={handleSubmit}>
          <input type="text" name="totp_code" />
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }

  if(session){
    return (
      <>テスト</>
    );
  }

  return (
    <>
      <Link href="/login" passHref>ログイン</Link><br/>
      <Link href="/registration" passHref>登録</Link>
    </>
  )
}

export default SettingsPage;