import { useRef, useCallback } from "react";
import { parseString } from "dxf";
import * as THREE from "three";

interface DXFImportProps {
  onImport: (geometry: THREE.BufferGeometry, position: [number, number, number]) => void;
  onClose: () => void;
}

export default function DXFImport({ onImport, onClose }: DXFImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dxfContent = e.target?.result as string;
        const parsed = parseString(dxfContent);

        // Convert DXF entities to Three.js geometry
        const geometry = convertDXFToGeometry(parsed);
        if (geometry) {
          // Calculate center and position
          geometry.computeBoundingBox();
          const bbox = geometry.boundingBox!;
          const center = new THREE.Vector3();
          bbox.getCenter(center);

          // Position at origin, offset by center
          const position: [number, number, number] = [-center.x, 0, -center.z];
          onImport(geometry, position);
        }
      } catch (error) {
        console.error("Error parsing DXF:", error);
        alert("Error parsing DXF file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  }, [onImport]);

  const convertDXFToGeometry = (parsed: any): THREE.BufferGeometry | null => {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];

    if (!parsed.entities) return null;

    // Process different entity types
    parsed.entities.forEach((entity: any, index: number) => {
      switch (entity.type) {
        case 'LINE':
          // Add line as thin rectangle
          const start = [entity.start.x, 0, entity.start.y];
          const end = [entity.end.x, 0, entity.end.y];
          addLineGeometry(vertices, indices, start, end, 0.1);
          break;

        case 'LWPOLYLINE':
        case 'POLYLINE':
          // Convert polyline to extruded shape
          if (entity.vertices && entity.vertices.length > 2) {
            const points = entity.vertices.map((v: any) => [v.x, 0, v.y]);
            addPolygonGeometry(vertices, indices, points, 3); // 3m height
          }
          break;

        case 'CIRCLE':
          // Add circle as cylinder
          addCircleGeometry(vertices, indices, [entity.center.x, 0, entity.center.y], entity.radius, 3);
          break;

        case 'ARC':
          // Approximate arc with line segments
          const arcPoints = approximateArc(entity);
          if (arcPoints.length > 1) {
            for (let i = 0; i < arcPoints.length - 1; i++) {
              addLineGeometry(vertices, indices, arcPoints[i], arcPoints[i + 1], 0.1);
            }
          }
          break;
      }
    });

    if (vertices.length === 0) return null;

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  };

  const addLineGeometry = (vertices: number[], indices: number[], start: number[], end: number[], thickness: number) => {
    const dx = end[0] - start[0];
    const dz = end[2] - start[2];
    const length = Math.sqrt(dx * dx + dz * dz);
    const nx = -dz / length * thickness / 2;
    const nz = dx / length * thickness / 2;

    const baseIndex = vertices.length / 3;

    // Bottom face
    vertices.push(
      start[0] + nx, start[1], start[2] + nz,
      start[0] - nx, start[1], start[2] - nz,
      end[0] + nx, end[1], end[2] + nz,
      end[0] - nx, end[1], end[2] - nz
    );

    // Top face (extruded)
    vertices.push(
      start[0] + nx, start[1] + 0.1, start[2] + nz,
      start[0] - nx, start[1] + 0.1, start[2] - nz,
      end[0] + nx, end[1] + 0.1, end[2] + nz,
      end[0] - nx, end[1] + 0.1, end[2] - nz
    );

    // Bottom face indices
    indices.push(baseIndex, baseIndex + 1, baseIndex + 2, baseIndex + 1, baseIndex + 3, baseIndex + 2);
    // Top face indices
    indices.push(baseIndex + 4, baseIndex + 6, baseIndex + 5, baseIndex + 5, baseIndex + 6, baseIndex + 7);
    // Side faces
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      indices.push(baseIndex + i, baseIndex + next, baseIndex + i + 4);
      indices.push(baseIndex + next, baseIndex + next + 4, baseIndex + i + 4);
    }
  };

  const addPolygonGeometry = (vertices: number[], indices: number[], points: number[][], height: number) => {
    if (points.length < 3) return;

    const baseIndex = vertices.length / 3;

    // Bottom face
    for (const point of points) {
      vertices.push(point[0], point[1], point[2]);
    }

    // Top face
    for (const point of points) {
      vertices.push(point[0], point[1] + height, point[2]);
    }

    // Bottom face triangulation
    for (let i = 1; i < points.length - 1; i++) {
      indices.push(baseIndex, baseIndex + i, baseIndex + i + 1);
    }

    // Top face triangulation
    const topBase = baseIndex + points.length;
    for (let i = 1; i < points.length - 1; i++) {
      indices.push(topBase, topBase + i + 1, topBase + i);
    }

    // Side faces
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      indices.push(baseIndex + i, baseIndex + next, topBase + i);
      indices.push(baseIndex + next, topBase + next, topBase + i);
    }
  };

  const addCircleGeometry = (vertices: number[], indices: number[], center: number[], radius: number, height: number) => {
    const segments = 16;
    const baseIndex = vertices.length / 3;

    // Bottom circle
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      vertices.push(
        center[0] + Math.cos(angle) * radius,
        center[1],
        center[2] + Math.sin(angle) * radius
      );
    }

    // Top circle
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      vertices.push(
        center[0] + Math.cos(angle) * radius,
        center[1] + height,
        center[2] + Math.sin(angle) * radius
      );
    }

    // Bottom face
    for (let i = 1; i < segments - 1; i++) {
      indices.push(baseIndex, baseIndex + i, baseIndex + i + 1);
    }

    // Top face
    const topBase = baseIndex + segments;
    for (let i = 1; i < segments - 1; i++) {
      indices.push(topBase, topBase + i + 1, topBase + i);
    }

    // Side faces
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      indices.push(baseIndex + i, baseIndex + next, topBase + i);
      indices.push(baseIndex + next, topBase + next, topBase + i);
    }
  };

  const approximateArc = (entity: any): number[][] => {
    const points: number[][] = [];
    const segments = 16;
    const startAngle = entity.startAngle || 0;
    const endAngle = entity.endAngle || Math.PI * 2;
    const angleRange = endAngle - startAngle;

    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (angleRange * i) / segments;
      points.push([
        entity.center.x + Math.cos(angle) * entity.radius,
        0,
        entity.center.y + Math.sin(angle) * entity.radius
      ]);
    }

    return points;
  };

  return (
    <div className="absolute top-16 left-16 z-50 w-80 bg-card border border-border rounded-lg shadow-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Import DXF Floor Plan</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Select a DXF file to import CAD floor plans. The geometry will be extruded into 3D building volumes.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".dxf"
        onChange={handleFileSelect}
        className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
      />

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Choose File
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}