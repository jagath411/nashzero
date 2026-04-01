import { Response } from 'express';
import Analysis, { IAnalysis } from '../models/Analysis';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

export const runAnalysis = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { buildingId, analysisType, metrics, summary } = req.body;

    if (!analysisType || !metrics) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const analysis = new Analysis({
      projectId,
      buildingId,
      analysisType,
      metrics,
      summary,
    });

    await analysis.save();

    // Update project with analysis data
    if (summary) {
      await Project.findByIdAndUpdate(projectId, {
        'analysis.$set': summary,
      });
    }

    res.status(201).json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalysis = async (
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

    const analyses = await Analysis.find({ projectId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      analyses,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalysisByType = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId, type } = req.params;

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const analysis = await Analysis.findOne({
      projectId,
      analysisType: type,
    }).sort({ createdAt: -1 });

    if (!analysis) {
      res.status(404).json({ error: 'No analysis found' });
      return;
    }

    res.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnalysis = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId, analysisId } = req.params;

    // Verify project ownership
    const project = await Project.findById(projectId);
    if (!project || project.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }

    await Analysis.findByIdAndDelete(analysisId);

    res.json({
      success: true,
      message: 'Analysis deleted',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
