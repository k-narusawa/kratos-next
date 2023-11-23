import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useCallback } from "react";

export const useHandleError = () => {
  const router = useRouter();

  return useCallback(
    (error: AxiosError): Promise<AxiosError | void> => {
      console.debug(`response: ${JSON.stringify(error.response)}`);
      if (!error.response || error.response?.status === 0) {
        window.location.href = `/error?error=${encodeURIComponent(
          JSON.stringify(error.response)
        )}`;
        return Promise.resolve();
      }

      // handle specific error ids here
      switch ((error.response.data as any).error.id) {
        case "session_aal2_required":
          router.push({
            pathname: "/login",
            query: {
              aal: "aal2",
            },
          });
          return Promise.resolve();
        case "session_already_available":
          router.push("/");
          return Promise.resolve();
        case "session_refresh_required":
          router.push({
            pathname: "/login",
            query: {
              refresh: true,
              returnTo: router.pathname,
            },
          });
          return Promise.resolve();
        case "self_service_flow_return_to_forbidden":
          // the flow expired, so just reload the page without the flow id
          router.push(router.pathname);
          return Promise.resolve();
        case "self_service_flow_expired":
          // the flow expired, so just reload the page without the flow id
          router.push(router.pathname);
          return Promise.resolve();
      }

      switch (error.response?.status) {
        // this could be many things, such as the session exists
        case 400:
          return Promise.reject(error);
        case 404:
          // The flow data could not be found. Let's just redirect to the error page!
          window.location.href = `/error?error=${encodeURIComponent(
            JSON.stringify(error.response)
          )}`;
          return Promise.resolve();
        // we need to parse the response and follow the `redirect_browser_to` URL
        // this could be when the user needs to perform a 2FA challenge
        // or passwordless login
        case 422:
          window.location.href = `${error.response.data.redirect_browser_to}`;
          return Promise.resolve();
        // we have no session or the session is invalid
        // we should redirect the user to the login page
        // don't handle it here, return the error so the caller can handle it
        case 401:
          return Promise.reject(error);
        case 410:
          // Status code 410 means the request has expired - so let's load a fresh flow!
          router.push(router.pathname);
          return Promise.resolve();
        default:
          // The flow could not be fetched due to e.g. network or server issues. Let's reload the page!
          // This will trigger the useEffect hook again and we will try to fetch the flow again.
          return Promise.resolve(router.reload());
      }
    },
    [router]
  );
};