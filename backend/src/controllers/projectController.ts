import { Response } from 'express';
import Project, { IProject } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, location, site } = req.body;

    if (!name || !location || !site) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const project = new Project({
      name,
      description,
      location,
      site,
      userId: req.userId,
    });

    await project.save();

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Check authorization
    if (project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    res.json({
      success: true,
      project,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, location, site, analysis } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Check authorization
    if (project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (location) project.location = location;
    if (site) project.site = site;
    if (analysis) project.analysis = analysis;

    await project.save();

    res.json({
      success: true,
      project,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Check authorization
    if (project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
