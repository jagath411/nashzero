import { Response } from 'express';
import Building, { IBuilding } from '../models/Building';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const createBuilding = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { name, type, position, dimensions, color, dxfUrl, geometry } = req.body;

    if (!name || !type || !position) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const building = new Building({
      projectId,
      name,
      type,
      position,
      dimensions,
      color,
      dxfUrl,
      geometry,
    });

    await building.save();

    res.status(201).json({
      success: true,
      building,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBuildingsByProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const buildings = await Building.find({ projectId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      buildings,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBuilding = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId, buildingId } = req.params;
    const { name, type, position, dimensions, color, dxfUrl, geometry } = req.body;

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const building = await Building.findById(buildingId);
    if (!building) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }

    // Update fields
    if (name) building.name = name;
    if (type) building.type = type;
    if (position) building.position = position;
    if (dimensions) building.dimensions = dimensions;
    if (color) building.color = color;
    if (dxfUrl) building.dxfUrl = dxfUrl;
    if (geometry) building.geometry = geometry;

    await building.save();

    res.json({
      success: true,
      building,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBuilding = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId, buildingId } = req.params;

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const building = await Building.findById(buildingId);
    if (!building) {
      res.status(404).json({ error: 'Building not found' });
      return;
    }

    await Building.findByIdAndDelete(buildingId);

    res.json({
      success: true,
      message: 'Building deleted',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
