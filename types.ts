export interface PredictionResult {
  prediction: string;
  confidence: number;
  top_predictions: [string, number][];
}

export interface HistoryItem {
  id: string;
  image: string; // Base64 data string of the character drawn or uploaded
  prediction: string;
  confidence: number;
  timestamp: string;
}
