// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveFile = async (data: any) => {
  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: data,
      },
    );
    const { IpfsHash } = await response.json();
    return IpfsHash;
  } catch (error) {
    throw error;
  }
};

export default saveFile;
