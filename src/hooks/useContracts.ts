import { useState, useCallback } from "react";
import { Contract } from "ethers";
import { useToast } from "./use-toast";
import { CONTRACT_ADDRESSES, ContractInstance } from "../config/contracts";
import shibutisABI from "../ContractAbis/ShibutisABI.json";

export const useContracts = () => {
  const [contracts, setContracts] = useState<ContractInstance | null>(null);
  const { toast } = useToast();

  const initializeContracts = useCallback(async (signer: any) => {
    // Prevent re-initialization if contracts already exist
    if (contracts?.shibutisContract) return;

    try {
      const shibutisContract = new Contract(
        CONTRACT_ADDRESSES.SHIBUTIS,
        shibutisABI,
        signer
      );

      setContracts({
        shibutisContract,
      });
    } catch (error) {
      console.error("Error initializing contracts:", error);
      toast({
        title: "Contract Initialization Failed",
        description: "Failed to initialize smart contract",
        variant: "destructive",
      });
    }
  }, [contracts?.shibutisContract, toast]);

  return {
    contracts,
    initializeContracts,
  };
};
