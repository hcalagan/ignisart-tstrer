/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AbstraxionProvider,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { useCallback } from "react";
import type {
  ExecuteInstruction,
  MsgExecuteContractEncodeObject,
} from "@cosmjs/cosmwasm-stargate";

type ExecuteParams = {
  contractAddress: string;
  msg: Record<string, unknown>;
  funds?: { denom: string; amount: string }[];
};

type QueryParams = {
  contractAddress: string;
  msg: Record<string, unknown>;
};

export {
  AbstraxionProvider,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
};

export function useAbstraxionContract() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  const bech32Address = account?.bech32Address;

  const queryContract = useCallback(
    async ({ contractAddress, msg }: QueryParams) => {
      if (!client) throw new Error("Signing client belum tersedia.");
      return await client.queryContractSmart(contractAddress, msg);
    },
    [client]
  );

  const executeContract = useCallback(
    async ({ contractAddress, msg, funds = [] }: ExecuteParams) => {
      if (!client || !bech32Address)
        throw new Error("Client atau address belum siap.");
      return await client.execute(
        bech32Address,
        contractAddress,
        msg,
        "auto",
        undefined,
        funds
      );
    },
    [client, bech32Address]
  );

  return {
    queryContract,
    executeContract,
    bech32Address,
  };
}
