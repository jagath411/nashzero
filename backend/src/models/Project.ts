import mongoose, { Schema, Document, Types } from 'mongoose';

export interface SiteBoundary {
  coordinates: [number, number][];
  center: [number, number];
  area: number;
}

export interface ProjectAnalysis {
  energyEUI?: number;
  peakCooling?: number;
  peakHeating?: number;
  pvOffset?: number;
  daylightFactor?: number;
  udi?: number;
  sdi?: number;
  windSpeed?: number;
  temperature?: number;
}

export interface IProject extends Document {
  name: string;
  description?: string;
  userId: Types.ObjectId;
  location: string;
  site: SiteBoundary;
  analysis?: ProjectAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    site: {
      coordinates: {
        type: [[Number]],
        required: true,
      },
      center: {
        type: [Number],
        required: true,
      },
      area: {
        type: Number,
        required: true,
      },
    },
    analysis: {
      energyEUI: Number,
      peakCooling: Number,
      peakHeating: Number,
      pvOffset: Number,
      daylightFactor: Number,
      udi: Number,
      sdi: Number,
      windSpeed: Number,
      temperature: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', projectSchema);
