import { useCallback, useEffect, useState } from "react";
import usePunks from "../usePunks";

const getPunkData = async ({ punks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    punks.methods.tokenURI(tokenId).call(),
    punks.methods.tokenDNA(tokenId).call(),
    punks.methods.ownerOf(tokenId).call(),
    punks.methods.getClotheColor(tokenId).call(),
    punks.methods.getClotheType(tokenId).call(),
    punks.methods.getEyeType(tokenId).call(),
    punks.methods.getEyeBrowType(tokenId).call(),
    punks.methods.getFacialHairColor(tokenId).call(),
    punks.methods.getFacialHairType(tokenId).call(),
    punks.methods.getHairColor(tokenId).call(),
    punks.methods.getHatColor(tokenId).call(),
    punks.methods.getGraphicType(tokenId).call(),
    punks.methods.getMouthType(tokenId).call(),
    punks.methods.getSkinColor(tokenId).call(),
    punks.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural
const usePunksData = () => {
  const [punksData, setPunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const punks = usePunks();

  const update = useCallback(async () => {
    if (punks) {
      setLoading(true);

      let tokenIds;

      const totalSupply = await punks.methods.totalSupply().call();
      tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, punks })
      );

      const punksResult = await Promise.all(punksPromise);

    

      setPunks(punksResult);
      setLoading(false);
    }
  }, [punks]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punksData,
    update,
  };
};

// Singular
const usePunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const punks = usePunks();

  const update = useCallback(async () => {
    if (punks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, punks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [punks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

export { usePunksData, usePunkData };
