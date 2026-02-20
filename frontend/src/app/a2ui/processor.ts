/**
 * A2UI Message Processor — React-friendly version.
 * Processes ServerToClientMessage[] into Surface objects with resolved component trees.
 * Uses plain JS objects instead of Maps for React-friendly state management.
 */

import type {
  AnyComponentNode,
  BeginRenderingMessage,
  ComponentInstance,
  DataModelUpdate,
  DataObject,
  DataValue,
  DeleteSurfaceMessage,
  ServerToClientMessage,
  Surface,
  SurfaceUpdateMessage,
  ValueMap,
} from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isComponentArrayRef(
  value: unknown
): value is { explicitList?: string[]; template?: { componentId: string; dataBinding: string } } {
  return isObject(value) && ("explicitList" in value || "template" in value);
}

export class A2UIProcessor {
  private surfaces = new Map<string, Surface>();

  getSurfaces(): ReadonlyMap<string, Surface> {
    return this.surfaces;
  }

  clearSurfaces(): void {
    this.surfaces.clear();
  }

  /**
   * Process an array of A2UI server messages.
   * Returns all current surfaces (a new Map reference for React state updates).
   */
  process(messages: ServerToClientMessage[]): Map<string, Surface> {
    for (const msg of messages) {
      if (msg.beginRendering) this.handleBeginRendering(msg.beginRendering);
      if (msg.surfaceUpdate) this.handleSurfaceUpdate(msg.surfaceUpdate);
      if (msg.dataModelUpdate) this.handleDataModelUpdate(msg.dataModelUpdate);
      if (msg.deleteSurface) this.handleDeleteSurface(msg.deleteSurface);
    }
    return new Map(this.surfaces);
  }

  /**
   * Get data from the data model at a given path.
   */
  getData(surfaceId: string, path: string): DataValue | undefined {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return undefined;
    return this.getByPath(surface.dataModel, path);
  }

  /**
   * Set data in the data model at a given path.
   * Returns a shallow clone of the surface for immutable React state.
   */
  setData(surfaceId: string, path: string, value: DataValue): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;
    this.setByPath(surface.dataModel, path, value);
    this.rebuildTree(surface);
  }

  /**
   * Resolve a StringValue (path or literal) against the data model.
   */
  resolveStringValue(
    surfaceId: string,
    sv: { path?: string; literalString?: string; literal?: string } | undefined,
    dataContextPath?: string
  ): string {
    if (!sv) return "";
    if (sv.literalString !== undefined) return sv.literalString;
    if (sv.literal !== undefined) return sv.literal;
    if (sv.path) {
      const fullPath = this.resolvePath(sv.path, dataContextPath);
      const val = this.getData(surfaceId, fullPath);
      return val != null ? String(val) : "";
    }
    return "";
  }

  resolvePath(path: string, dataContextPath?: string): string {
    if (path.startsWith("/")) return path;
    if (dataContextPath && dataContextPath !== "/") {
      return dataContextPath.endsWith("/")
        ? `${dataContextPath}${path}`
        : `${dataContextPath}/${path}`;
    }
    return `/${path}`;
  }

  // ---- Private: message handlers ----

  private getOrCreateSurface(surfaceId: string): Surface {
    let surface = this.surfaces.get(surfaceId);
    if (!surface) {
      surface = {
        id: surfaceId,
        rootComponentId: null,
        componentTree: null,
        dataModel: {},
        components: new Map(),
        styles: {},
      };
      this.surfaces.set(surfaceId, surface);
    }
    return surface;
  }

  private handleBeginRendering(msg: BeginRenderingMessage): void {
    const surface = this.getOrCreateSurface(msg.surfaceId);
    surface.rootComponentId = msg.root;
    surface.styles = msg.styles ?? {};
    this.rebuildTree(surface);
  }

  private handleSurfaceUpdate(msg: SurfaceUpdateMessage): void {
    const surface = this.getOrCreateSurface(msg.surfaceId);
    for (const comp of msg.components) {
      surface.components.set(comp.id, comp);
    }
    this.rebuildTree(surface);
  }

  private handleDataModelUpdate(msg: DataModelUpdate): void {
    const surface = this.getOrCreateSurface(msg.surfaceId);
    const path = msg.path ?? "/";
    const value = this.convertValueMaps(msg.contents);
    this.setByPath(surface.dataModel, path, value);
    this.rebuildTree(surface);
  }

  private handleDeleteSurface(msg: DeleteSurfaceMessage): void {
    this.surfaces.delete(msg.surfaceId);
  }

  // ---- Private: data model helpers ----

  private normalizePath(path: string): string[] {
    const dotPath = path.replace(/\[(\d+)\]/g, ".$1");
    return dotPath
      .split(/[./]/)
      .filter((s) => s.length > 0);
  }

  private getByPath(root: DataObject, path: string): DataValue | undefined {
    const segments = this.normalizePath(path);
    let current: DataValue = root;
    for (const seg of segments) {
      if (current == null) return undefined;
      if (isObject(current)) {
        current = (current as DataObject)[seg];
      } else if (Array.isArray(current) && /^\d+$/.test(seg)) {
        current = current[parseInt(seg, 10)];
      } else {
        return undefined;
      }
    }
    return current;
  }

  private setByPath(root: DataObject, path: string, value: DataValue): void {
    const segments = this.normalizePath(path);
    if (segments.length === 0) {
      if (isObject(value)) {
        Object.assign(root, value);
      }
      return;
    }
    let current: DataValue = root;
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      if (isObject(current)) {
        if (!(current as DataObject)[seg] || typeof (current as DataObject)[seg] !== "object") {
          (current as DataObject)[seg] = {};
        }
        current = (current as DataObject)[seg];
      } else if (Array.isArray(current) && /^\d+$/.test(seg)) {
        current = current[parseInt(seg, 10)];
      }
    }
    const finalSeg = segments[segments.length - 1];
    if (isObject(current)) {
      (current as DataObject)[finalSeg] = value;
    } else if (Array.isArray(current) && /^\d+$/.test(finalSeg)) {
      current[parseInt(finalSeg, 10)] = value;
    }
  }

  private convertValueMaps(maps: ValueMap[]): DataValue {
    if (maps.length === 1 && maps[0].key === ".") {
      const item = maps[0];
      if (item.valueString !== undefined) return item.valueString;
      if (item.valueNumber !== undefined) return item.valueNumber;
      if (item.valueBoolean !== undefined) return item.valueBoolean;
      if (item.valueMap) return this.convertValueMaps(item.valueMap);
    }
    const result: DataObject = {};
    for (const item of maps) {
      const key = item.key;
      if (item.valueString !== undefined) result[key] = item.valueString;
      else if (item.valueNumber !== undefined) result[key] = item.valueNumber;
      else if (item.valueBoolean !== undefined) result[key] = item.valueBoolean;
      else if (item.valueMap) result[key] = this.convertValueMaps(item.valueMap);
    }
    return result;
  }

  // ---- Private: component tree building ----

  private rebuildTree(surface: Surface): void {
    if (!surface.rootComponentId) {
      surface.componentTree = null;
      return;
    }
    const visited = new Set<string>();
    surface.componentTree = this.buildNode(
      surface.rootComponentId,
      surface,
      visited,
      "/",
      ""
    );
  }

  private buildNode(
    baseId: string,
    surface: Surface,
    visited: Set<string>,
    dataContextPath: string,
    idSuffix: string
  ): AnyComponentNode | null {
    const fullId = `${baseId}${idSuffix}`;
    if (!surface.components.has(baseId)) return null;
    if (visited.has(fullId)) return null;

    visited.add(fullId);

    const compData = surface.components.get(baseId)!;
    const compProps = compData.component ?? {};
    const compType = Object.keys(compProps)[0];
    const rawProps = compProps[compType] as Record<string, unknown> | undefined;

    const resolved: Record<string, unknown> = {};
    if (rawProps && isObject(rawProps)) {
      for (const [key, val] of Object.entries(rawProps)) {
        resolved[key] = this.resolveProperty(
          val,
          surface,
          visited,
          dataContextPath,
          idSuffix,
          key
        );
      }
    }

    visited.delete(fullId);

    return {
      id: fullId,
      type: compType,
      dataContextPath,
      weight: compData.weight,
      properties: resolved,
    } as AnyComponentNode;
  }

  private resolveProperty(
    value: unknown,
    surface: Surface,
    visited: Set<string>,
    dataContextPath: string,
    idSuffix: string,
    key: string | null
  ): unknown {
    // Child component reference
    if (
      typeof value === "string" &&
      key &&
      (key === "child" || key.endsWith("Child")) &&
      surface.components.has(value)
    ) {
      return this.buildNode(value, surface, visited, dataContextPath, idSuffix);
    }

    // Component array reference (children / template)
    if (isComponentArrayRef(value)) {
      if (value.explicitList) {
        return value.explicitList
          .map((id) => this.buildNode(id, surface, visited, dataContextPath, idSuffix))
          .filter(Boolean);
      }
      if (value.template) {
        const fullPath = this.resolvePath(value.template.dataBinding, dataContextPath);
        const data = this.getByPath(surface.dataModel, fullPath);
        const templateId = value.template.componentId;

        if (Array.isArray(data)) {
          return data
            .map((_, index) => {
              const newSuffix = `:${index}`;
              const childCtx = `${fullPath}/${index}`;
              return this.buildNode(templateId, surface, visited, childCtx, newSuffix);
            })
            .filter(Boolean);
        }
        if (isObject(data)) {
          return Object.keys(data)
            .map((k) => {
              const newSuffix = `:${k}`;
              const childCtx = `${fullPath}/${k}`;
              return this.buildNode(templateId, surface, visited, childCtx, newSuffix);
            })
            .filter(Boolean);
        }
        return [];
      }
    }

    // Plain array
    if (Array.isArray(value)) {
      return value.map((item) =>
        this.resolveProperty(item, surface, visited, dataContextPath, idSuffix, key)
      );
    }

    // Plain object — resolve recursively
    if (isObject(value)) {
      const obj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) {
        // Strip path prefixes for template data contexts
        if (k === "path" && typeof v === "string" && dataContextPath !== "/") {
          obj[k] = v
            .replace(/^\.?\/item/, "")
            .replace(/^\.?\/text/, "")
            .replace(/^\.?\/label/, "")
            .replace(/^\.?\//, "") || v;
          continue;
        }
        obj[k] = this.resolveProperty(v, surface, visited, dataContextPath, idSuffix, k);
      }
      return obj;
    }

    return value;
  }
}
