// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveFile = async (data: any) => {
  try {
    console.log('Starting IPFS upload...');
    // Get JWT from environment in server context
    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      throw new Error('Pinata JWT not found in environment');
    }
    
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: data,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata response error:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log('IPFS upload response:', responseData);
    
    const { IpfsHash } = responseData;
    if (!IpfsHash) {
      console.error('No IPFS hash returned');
      throw new Error('Failed to upload to IPFS - no hash returned');
    }
    return IpfsHash;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
};

export default saveFile;
