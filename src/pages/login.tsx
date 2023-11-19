import { LoginFlow } from "@ory/client";
import { FormEventHandler, useEffect, useState } from "react";
import ory from "../../pkg/sdk";
import Error from "next/error";
import { useRouter } from "next/router";
import TextInput from "@/src/components/TextInput";
import Button from "@/src/components/Button";
import { AxiosError } from "axios";

const LoginPage = () => {
  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;
  const [flow, setFlow] = useState<LoginFlow>();

  useEffect(() => {
    if (!router.isReady || flow) {
      return;
    } 

    ory
      .toSession()
      .then(({ data }) => {
        console.log(data);
        router.push("/dashboard");
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return;
          default: 
            console.error(err);
            break;
        }
      });

    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          data.active
          setFlow(data);
        }).catch(({ err }) => {
          console.error(err);
        });
    } else {
      ory
        .createBrowserLoginFlow({
          returnTo: returnTo ? String(returnTo) : undefined,
        })
        .then(({ data }) => {
          setFlow(data);
        }).catch(({ err }) => {
          console.error(err);
        });
    }
  }, [flowId, router, router.isReady, returnTo, flow]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!flow) {
      return <div>Flow not found</div>;
    }

    const form = new FormData(event.currentTarget);
    const identifier = form.get("identifier") || "";
    const password = form.get("password") || "";

    const csrf_token = flow.ui.nodes.find(
      (node) => (
        node.group === "default"
        && 'name' in node.attributes
        && node.attributes.name === "csrf_token"
      ))?.attributes.value || "";

    await ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          "csrf_token": csrf_token,
          "method": "password",
          identifier: identifier.toString(),
          password: password.toString(),
        },
      }).then(async ({ data }) => {
        console.log(data);
      
        // アクションによってはここで色々やる
        await router.push(flow.return_to || "/dashboard");
      }).catch((err) => {
        console.error(err);
      });
  };

  if (!flow) {
    return <Error statusCode={500}></Error>;
  };

  return (
    <div className="
      flex items-center justify-center h-screen 
      bg-gray-50 dark:bg-gray-900
    ">
      <form className="
        w-full max-w-md p-8 space-y-4 
        bg-white rounded-lg shadow dark:bg-gray-800
      " onSubmit={handleSubmit}>
        <h5 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">ログイン</h5>
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
    </div>
  );
};

export default LoginPage;
