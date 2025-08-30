import { useState } from "react";
import { Contract } from "ethers";
import { useToast } from "./use-toast";
import { CONTRACT_ADDRESSES, ContractInstance } from "../config/contracts";
import shibutisABI from "../ContractAbis/ShibutisABI.json";

export const useContracts = () => {
  const [contracts, setContracts] = useState<ContractInstance | null>(null);
  const { toast } = useToast();

  const initializeContracts = async (signer: any) => {
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
  };

  return {
    contracts,
    initializeContracts,
  };
};