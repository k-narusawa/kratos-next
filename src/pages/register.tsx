import { RegistrationFlow } from "@ory/client";
import { NextPageContext } from "next";
import { InputHTMLAttributes, useState } from "react";
import ory from "../../pkg/sdk"

const RegisterPage = ({
  flowData,
}: {
  flowData: RegistrationFlow;
}) => {
  console.log(flowData)
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Register</h1>
        <form method="POST" action={flowData.ui.action}>
          {flowData.ui.nodes
            .filter((node) => node.group === "default")
            .map((node) => {
              return (
                <input
                  {...(node.attributes as InputHTMLAttributes<HTMLInputElement>)}
                  key="csrf_token"
                />
              );
            })}
          <input
            type="email"
            id="traits.email"
            name="traits.email"
            required
            placeholder="email"
          />
          <input
            name="password"
            type="password"
            id="password"
            required
            placeholder="password"
          />
          <button type="submit" name="method" value="password">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const allCookies = context?.req?.headers.cookie;
  const flowId = context.query.flow;
  const returnTo = context.query.return_to;

  if (!flowId) {
    console.log("no flow id")
    ory
      .createBrowserRegistrationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        console.log(data)
        return {
          redirect: {
            destination: `http://127.0.0.1:4455/registration?flow=${data.id}`,
          },
        };
      }
    ).catch((err) => {
      console.log(err.response?.data)
    })
  }

  if (allCookies && flowId) {
    const data = await ory
      .getRegistrationFlow({ id: String(flowId), cookie: allCookies}, { withCredentials: true, xsrfCookieName: "csrf_token", xsrfHeaderName: "X-CSRF-Token"})
      .then(({ data }) => {
        console.log(data)
        return data;
      })
      .catch((err) => {
        console.log(err.response?.data)
      });
    const flowData = data;
    return {
      props: {
        flowData,
      },
    };
  }
  return {
    redirect: {
      destination: `http://127.0.0.1:4455/api/.ory/self-service/registration/browser`,
    },
  };
}

export default RegisterPage;