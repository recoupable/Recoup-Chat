export interface AssessmentInputManifest {
  compilerVersion: string;
  method: string;
  requestIds: string[];
  excludedTopics: string[];
  documents: {
    documentId: string;
    resultId: string | null;
    subjectId: string;
    topic: string;
    version: number;
    sourceVersionIds: string[];
  }[];
}

export interface CompanyAssessmentBrief {
  purpose: "company_onboarding";
  text: string;
  readiness: string;
  missingTopics: string[];
  guidance: string;
  input_manifest?: AssessmentInputManifest;
}
export type CompanyAssessmentSnapshot = {
  id: string;
  superseded?: boolean;
  created_at?: string;
} & (
  | { state: "saved"; brief: CompanyAssessmentBrief }
  | { state: "unavailable"; brief: null }
);
