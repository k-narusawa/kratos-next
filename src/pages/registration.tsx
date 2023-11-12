import { RegistrationFlow } from "@ory/client";
import { FormEventHandler, useEffect, useState } from "react";
import ory from "../../pkg/sdk"
import Error from "next/error";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query
  const [flow, setFlow] = useState<RegistrationFlow>()

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    console.log(flowId)
    if (flowId) {
      console.log(flowId)
      ory
        .getRegistrationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        }).catch(({err}) => {
          console.log(err)
        })
    }

    ory
      .createBrowserRegistrationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      }).catch(({err}) => {
        console.log(err)
      })
  }, [flowId, router, router.isReady, returnTo, flow])
  
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    if(!flow){
      return (<div>Flow not found</div>)
    }
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("traits.email") || "";
    const password = form.get("password") || "";

    const csrf_token = flow.ui.nodes.find(
      (node) => (
        node.group === "default" 
        && 'name' in node.attributes 
        && node.attributes.name === "csrf_token"
      ))?.attributes.value || "";

    console.log(flow)

    ory.
      updateRegistrationFlow(
        {
          flow: flow.id,
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
        await router.push(flow?.return_to || "/")
      }).catch((err) => {
        console.log(err)
      });
  };

  if(!flow) {
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

export default RegisterPage;
