import mongoose, { Schema, Document, Types } from 'mongoose';

export interface AnalysisMetrics {
  type: 'energy' | 'solar' | 'daylight' | 'wind' | 'indoor-air';
  value: number;
  unit: string;
  timestamp: Date;
  details?: any;
}

export interface IAnalysis extends Document {
  projectId: Types.ObjectId;
  buildingId?: Types.ObjectId;
  analysisType: 'energy' | 'solar' | 'daylight' | 'wind' | 'indoor-air';
  metrics: AnalysisMetrics[];
  summary: any;
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
    },
    analysisType: {
      type: String,
      enum: ['energy', 'solar', 'daylight', 'wind', 'indoor-air'],
      required: true,
    },
    metrics: [
      {
        type: {
          type: String,
          enum: ['energy', 'solar', 'daylight', 'wind', 'indoor-air'],
        },
        value: Number,
        unit: String,
        timestamp: Date,
        details: Schema.Types.Mixed,
      },
    ],
    summary: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAnalysis>('Analysis', analysisSchema);
