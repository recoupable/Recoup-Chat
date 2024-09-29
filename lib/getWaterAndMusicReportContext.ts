import { promises as fs } from 'fs';

interface Section {
    title: string;
    key_findings: string[];
}

const getWaterAndMusicReportContext = async () => {
    const BASE_PATH = 'https://ipfs.decentralized-content.com/ipfs/';
    const additionalAnalysisResponse = await fetch(`${BASE_PATH}QmNsgeitiuZyLF735xAXLHAzMoEy8ayQFsg3bK3Had5Y3z`);
    const stateOfMusicDataResponse = await fetch(`${BASE_PATH}Qmcjsns4RBm2yU7quLcJN949DQZds27iumtX7tDtchxkZk`);

    const additionalAnalysis = await additionalAnalysisResponse.json();
    const stateOfMusicData = await stateOfMusicDataResponse.json();

    const context = {
      additional_analysis: additionalAnalysis.additional_analysis.map((item: { topic: string; key_findings: string[] }) => ({
        topic: item.topic,
        key_findings: item.key_findings
      })),
      state_of_music_data: {
        report_title: stateOfMusicData.report_title,
        prologue: {
          title: stateOfMusicData.prologue.title,
          key_points: stateOfMusicData.prologue.key_points
        },
        sections: stateOfMusicData.sections.map((section: Section) => ({
          title: section.title,
          key_findings: section.key_findings
        }))
      }
    };

    return context;
};

export default getWaterAndMusicReportContext;