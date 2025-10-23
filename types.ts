
import { type GroundingChunk } from '@google/genai';

export interface KeyPoint {
  point: string;
  isVerified: boolean;
  evidence: string;
}

export interface VerificationResultData {
  authenticityPercentage: number;
  summary: string;
  keyPoints: KeyPoint[];
}

export interface VerificationResult {
  type: 'verification';
  data: VerificationResultData;
  sources: GroundingChunk[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  verificationResult?: VerificationResult;
}
