import { RegistrationFlow } from "@ory/client";
import { NextPage, NextPageContext } from "next";
import { FormEventHandler } from "react";
import ory from "../../pkg/sdk"
import Error from "next/error";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterPage = ({
  flowData,
}: {
  flowData: RegistrationFlow;
}) => {
  const router = useRouter()
  
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("traits.email") || "";
    const password = form.get("password") || "";

    const csrf_token = flowData.ui.nodes.find(
      (node) => (
        node.group === "default" 
        && 'name' in node.attributes 
        && node.attributes.name === "csrf_token"
      ))?.attributes.value || "";

    console.log(flowData)

    ory.
      updateRegistrationFlow(
        {
          flow: flowData.id,
          updateRegistrationFlowBody: {
            "csrf_token": csrf_token,
            traits: {
              email: email,
            },
            "method": "password",          
            password: password,
          },
        }).then(async ({ data }) => {
        console.log("This is the user session: ", data, data.identity)

        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_verification_ui":
                await router.push("/verification?flow=" + item.flow.id)
                return;
            }
          }
        }

        // If continue_with did not contain anything, we can just return to the home page.
        await router.push(flowData?.return_to || "/")
      }).catch((err) => {
        console.log(err)
      });
  };

  if(!flowData) {
    return <Error statusCode={500}></Error>
  };
  
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
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
  let flowId = context.query.flow;
  let data = null;

  if (allCookies && flowId) {
    console.log(`flow id: ${flowId}`)
    const data = await ory
      .getRegistrationFlow(
        { id: String(flowId), cookie: allCookies },
      ).then(({ data }) => {
        return data;
      }).catch((err) => {
        console.log(err);
        return null;
      });
    const flowData = data;
    return {
      props: {
        flowData,
      },
    };
  }

  if (!flowId) {
    console.log("No flow id found, redirecting to registration flow")
    data = await ory
      .createBrowserRegistrationFlow({})
        .then(({ data }) => {
          return data
        }).catch((err) => {
          console.log(err);
        });
  }

  console.log(data)

  return {
    props: {
      flowData: data,
    },
  };
}

export default RegisterPage;
