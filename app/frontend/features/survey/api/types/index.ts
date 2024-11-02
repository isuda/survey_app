export interface Survey {
  id: number;
  name: string;
  questions: Question[];
}

export interface Question {
  id: number;
  title: string;
  type: string;
  min?: number;
  max?: number;
  limit?: number;
}

export interface SurveyResponse {
  question_id: number;
  value: any;
}
