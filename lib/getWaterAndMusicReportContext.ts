import { promises as fs } from 'fs';

interface Section {
    title: string;
    key_findings: string[];
}

const getWaterAndMusicReportContext = async () => {
    const additionalAnalysis = await fs.readFile('data/additional_analysis.json', 'utf-8');
    const stateOfMusicData = await fs.readFile('data/state_of_music_data_2024.json', 'utf-8');

    const parsedAdditionalAnalysis = JSON.parse(additionalAnalysis);
    const parsedStateOfMusicData = JSON.parse(stateOfMusicData);

    const context = {
      additional_analysis: parsedAdditionalAnalysis.additional_analysis.map((item: { topic: string; key_findings: string[] }) => ({
        topic: item.topic,
        key_findings: item.key_findings
      })),
      state_of_music_data: {
        report_title: parsedStateOfMusicData.report_title,
        prologue: {
          title: parsedStateOfMusicData.prologue.title,
          key_points: parsedStateOfMusicData.prologue.key_points
        },
        sections: parsedStateOfMusicData.sections.map((section: Section) => ({
          title: section.title,
          key_findings: section.key_findings
        }))
      }
    };

    return context;
};

export default getWaterAndMusicReportContext;