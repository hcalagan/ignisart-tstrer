// pages/index.tsx atau index.js
import React from 'react';

export default function Home() {
  return <div>Hello World</div>;
}

import {
  AbstraxionProvider,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { useCallback } from "react";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";

export {
  AbstraxionProvider,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
};

export function useAbstraxionContract() {
  const { client } = useAbstraxionSigningClient();
  const account = useAbstraxionAccount() as { bech32Address?: string };
  const bech32Address = account.bech32Address;

  const queryContract = useCallback(
    async ({
      contractAddress,
      msg,
    }: {
      contractAddress: string;
      msg: Record<string, unknown>;
    }): Promise<unknown> => {
      if (!client) throw new Error("Signing client belum tersedia.");
      return await client.queryContractSmart(contractAddress, msg);
    },
    [client]
  );

  const executeContract = useCallback(
    async ({
      contractAddress,
      msg,
      funds = [],
      memo,
    }: {
      contractAddress: string;
      msg: Record<string, unknown>;
      funds?: { denom: string; amount: string }[];
      memo?: string;
    }): Promise<ExecuteResult> => {
      if (!client || !bech32Address)
        throw new Error("Client atau alamat wallet belum tersedia.");
      return await client.execute(
        bech32Address,
        contractAddress,
        msg,
        "auto",
        memo,
        funds
      );
    },
    [client, bech32Address]
  );

  return {
    queryContract,
    executeContract,
    bech32Address: bech32Address ?? "",
  };
}
