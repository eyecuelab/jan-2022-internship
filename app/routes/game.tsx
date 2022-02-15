import { useState } from "react";
import { Outlet, redirect } from "remix";
import { useInterval } from "usehooks-ts";

function Game() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Game;
