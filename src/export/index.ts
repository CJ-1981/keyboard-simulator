import type { Design, ExportEnvelope } from '../store/types';
import { APP_VERSION, SCHEMA_VERSION } from '../store/types';
import { renderKeyboardSVG } from '../render/KeyboardRenderer';
import { getLayout } from '../layouts';

/** Serialize a Design to a JSON envelope string suitable for download. */
export function exportDesignToJSON(design: Design): string {
  const envelope: ExportEnvelope = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    design,
  };
  return JSON.stringify(envelope, null, 2);
}

/** Parse and validate an imported JSON envelope. Throws on invalid input. */
export function importDesignFromJSON(jsonText: string): Design {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    throw new Error('Invalid JSON: ' + (e as Error).message);
  }
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('JSON root must be an object');
  }
  const env = parsed as Partial<ExportEnvelope> & { design?: unknown };
  if (!env.design || typeof env.design !== 'object') {
    // Maybe the user uploaded a bare Design instead of an envelope — accept it.
    const bare = parsed as Partial<Design>;
    if (bare.id && bare.layout && Array.isArray(bare.keycaps)) {
      return normalizeDesign(bare as Design);
    }
    throw new Error('JSON does not contain a valid design');
  }
  return normalizeDesign(env.design as Design);
}

function normalizeDesign(d: Design): Design {
  if (!d.id) throw new Error('Design missing id');
  if (!d.layout) throw new Error('Design missing layout');
  if (!Array.isArray(d.keycaps)) throw new Error('Design missing keycaps array');
  // Force a fresh id to avoid collisions with existing designs
  return {
    ...d,
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    name: d.name || 'Imported Design',
    description: d.description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Render the keyboard to a PNG blob at 2× DPI for retina / print.
 * Returns a Blob URL that the caller should revoke after use.
 */
export async function exportDesignToPNG(design: Design): Promise<Blob> {
  const layout = getLayout(design.layout);
  const { svg } = renderKeyboardSVG(layout, design.keycaps, { scale: 1 });

  // Wrap SVG in an XML document
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load SVG into Image'));
      img.src = url;
    });

    // 2× DPI for retina
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob returned null'));
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Trigger a browser download of a blob with a given filename. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Sanitize a design name into a filesystem-safe filename. */
export function sanitizeFilename(name: string): string {
  return (name || 'untitled')
    .replace(/[^a-zA-Z0-9-_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase() || 'untitled';
}
