import { LoopsClient } from "loops";

const loopsClient = new LoopsClient(process.env.LOOPS_API_KEY as string);

export default loopsClient;
