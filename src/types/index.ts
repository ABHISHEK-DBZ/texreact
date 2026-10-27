export interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
  explanation?: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  caption: string;
  alt?: string;
}

export interface TableData {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface QuestionItem {
  id: string;
  questionNumber?: number | string;
  subjectId: string;
  experimentId?: string;
  question: string;
  answer: string;
  category?: 'viva' | 'post-lab' | 'theory' | 'conceptual' | 'supplementary';
  diagramUrl?: string;
  codeSnippet?: CodeSnippet;
  sourceDoc?: string;
  pageNumber?: number | string;
  reviewNeeded?: boolean;
}

export interface PrerequisiteItem {
  concept: string;
  explanation: string;
  example?: string;
}

export interface LineByLineItem {
  lineRange: string;
  codeSnippet: string;
  whatItDoes: string;
  whyNeeded: string;
  variables?: string;
  conditionOrOperation?: string;
  contribution: string;
}

export interface DryRunStep {
  stepNumber: number;
  action: string;
  stateOrVariables: string;
  outputOrLog?: string;
}

export interface DryRunData {
  title: string;
  description: string;
  initialInput: string;
  steps: DryRunStep[];
  finalOutput: string;
}

export interface QuickRevisionData {
  keyTakeaways: string[];
  commonPitfalls: string[];
  examTips: string[];
}

export interface Experiment {
  id: string;
  subjectId: string;
  expNumber: number | string;
  title: string;
  chapter?: string;
  topic?: string;
  aim: string;
  problemStatement?: string;
  theory?: string;
  prerequisites?: PrerequisiteItem[];
  algorithm?: string[];
  pseudocode?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  complexityExplanation?: string;
  codeSnippets: CodeSnippet[];
  lineByLineExplanation?: LineByLineItem[];
  dryRun?: DryRunData;
  sampleInput?: string;
  sampleOutput?: string;
  outputExplanation?: string;
  explanation?: string;
  logicDiagrams?: MediaAsset[];
  truthTable?: TableData;
  booleanExpression?: string;
  waveforms?: MediaAsset[];
  observationTable?: TableData;
  simulationSetup?: {
    software: string;
    directives: string[];
    parameters?: { name: string; value: string; description: string }[];
    notes?: string;
  };
  componentsList?: {
    designator: string;
    component: string;
    value: string;
    description: string;
  }[];
  traceBreakdown?: {
    label: string;
    signal: string;
    color: string;
    type: string;
    behavior: string;
  }[];
  result?: string;
  conclusion?: string;
  vivaQuestions?: QuestionItem[];
  postExpQuestions?: QuestionItem[];
  quickRevision?: QuickRevisionData;
  sourceReference?: {
    docName?: string;
    pageNumber?: number | string;
    reviewNeeded?: boolean;
    notes?: string;
  };
}

export interface Subject {
  id: string;
  name: string;
  shortCode: string;
  description: string;
  iconName: string;
  accentColor: string;
  isConfirmedName?: boolean;
  experiments: Experiment[];
  questionBank: QuestionItem[];
}

export interface SearchResultItem {
  type: 'experiment' | 'question' | 'code' | 'viva' | 'theory';
  subjectId: string;
  subjectName: string;
  experimentId?: string;
  experimentNumber?: number | string;
  title: string;
  snippet: string;
  matchField: string;
  item: Experiment | QuestionItem;
}

export interface UserProgress {
  bookmarks: string[];
  reviewedItems: string[];
  recentlyViewed: {
    id: string;
    type: 'experiment' | 'question';
    subjectId: string;
    title: string;
    timestamp: number;
  }[];
}
