import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";


import type { MetaFunction } from "remix";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export default function App() {
  const API_KEY = '';
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
        {process.env.API_KEY}
      </body>
    </html>
  );
}
