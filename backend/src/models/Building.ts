import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBuilding extends Document {
  projectId: Types.ObjectId;
  name: string;
  type: 'box' | 'dxf' | 'custom';
  position: [number, number, number];
  dimensions?: [number, number, number];
  color: string;
  dxfUrl?: string;
  geometry?: any;
  createdAt: Date;
  updatedAt: Date;
}

const buildingSchema = new Schema<IBuilding>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['box', 'dxf', 'custom'],
      default: 'box',
    },
    position: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: any) => Array.isArray(v) && v.length === 3,
        message: 'Position must be [x, y, z]',
      },
    },
    dimensions: [Number],
    color: {
      type: String,
      default: '#94a3b8',
    },
    dxfUrl: String,
    geometry: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBuilding>('Building', buildingSchema);
