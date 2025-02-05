import analyzeArtist from "../tools/analyzeArtist";
import createArtist from "../tools/createArtist";
import getSegmentsReport from "../tools/getSegmentsReport";

const getTools = (question: string) => {
  return {
    createArtist: createArtist(question),
    analyzeArtist: analyzeArtist(question),
    getSegmentsReport: getSegmentsReport(question),
  };
};

export default getTools;
