import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import dotenv from 'dotenv/config';



const apiKey = process.env.REACT_APP_INFURA_IPFS_API_KEY;
const apiKeySecret = process.env.REACT_APP_INFURA_IPFS_API_KEY_SECRET;


const auth =
  "Basic " + Buffer.from(apiKey + ":" + apiKeySecret).toString("base64");

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', headers: { authorization: auth} });

export default  async function  handleImageUpload( base64String: string)  {
    const base64Data = base64String.replace(/^data:image\/(.*);base64,/, '');
    const imageBuffer = Buffer.from(base64Data, "base64");
    
    if (imageBuffer) {
        const res =await ipfs.add(imageBuffer);
        const cid = res.cid.toString();
        return cid;
    }
    return ""
   
};
