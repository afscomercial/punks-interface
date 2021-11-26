import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import PunksArtifact from "../../config/web3/artifacts/Punks";

const { address, abi } = PunksArtifact;

const usePunks = () => {
  const { active, library, chainId } = useWeb3React();

  const punks = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return punks;
};

export default usePunks;
