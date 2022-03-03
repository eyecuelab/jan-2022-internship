import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
//import globalStyles from "~/styles/global.css";
import type { MetaFunction } from "remix";
import Modal from "react-modal";
import globalStyles from "~/styles/global.css";
import errStyles from "~/styles/err.css";
import { FC } from "react";

export const links = () => [
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: errStyles },
];

export const meta: MetaFunction = () => {
  return { title: "Watch This!" };
};

Modal.setAppElement("body");

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export const ErrorBoundary: FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="root-err">
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
};

export function CatchBoundary() {
  const caught = useCatch();

  let err404;
  if (caught.status === 404) {
    err404 = caught.status;
  }

  let err500;
  if (caught.status === 500) {
    err500 = caught.status;
  }

  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* <h1>
          {caught.status} {caught.statusText}
        </h1> */}
        {err404 && (
          <div>
            <div className="code-area">
              <span
                style={{
                  color: "#777",
                  fontStyle: "italic",
                }}
              >
                {"// 404 page not found."}
              </span>
              <span>
                <span style={{ color: "#d65562" }}>if</span>(
                <span style={{ color: "#4ca8ef" }}>!</span>
                <span style={{ fontStyle: "italic", color: "#bdbdbd" }}>
                  found
                </span>
                )
              </span>
              {"{"}
              <span>
                <span style={{ paddingLeft: "15px", color: "#2796ec" }}>
                  <i style={{ width: "10px", display: "inline-block" }}></i>
                  throw
                </span>
                <span>
                  (<span style={{ color: "#a6a61f" }}>{'"(╯°□°)╯︵ ┻━┻"'}</span>
                  );
                </span>
                <span style={{ display: "block" }}>{"}"} </span>
                <span style={{ color: "#777", fontStyle: "italic" }}>
                  {"//"} <a href="/">Go home!</a>
                </span>
              </span>
            </div>
          </div>
        )}
        {err500 && redirect("/error")}
        <Scripts />
      </body>
    </html>
  );
}
