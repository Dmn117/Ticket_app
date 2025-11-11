//! CLI by https://github.com/Dmn117


export interface ErrorResponse {
    detail: string;
}


export interface TrainingData {
    description: string;
    label: number;
}


export interface TrainingResult {
    message: string;
    examples: number;
    trainingData: TrainingData[]
}


export interface ClassificationResult {
    classification: string;
    score: number;
}