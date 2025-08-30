import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useMemo } from 'react';
import { type Config, useConnectorClient } from 'wagmi';

export function clientToSigner(client: any): JsonRpcSigner | undefined {
    if (!client || !client.account || !client.chain || !client.transport) {
        return undefined;
    }
    const { account, chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    try {
        const provider = new BrowserProvider(transport as any, network);
        const signer = new JsonRpcSigner(provider, account.address);
        return signer;
    } catch (error) {
        console.error("Error creating ethers signer:", error);
        return undefined;
    }
}

// This hook NOW ONLY converts the currently connected client, regardless of chain.
// The chain check happens *before* calling this hook.
export function useEthersSigner(): JsonRpcSigner | undefined {
    // Note: No chainId prop here. It gets the client for the *active* connection.
    const { data: client } = useConnectorClient<Config>();
    return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}