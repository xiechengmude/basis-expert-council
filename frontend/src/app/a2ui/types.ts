/**
 * A2UI Protocol Types — React-friendly subset.
 * Adapted from Google A2UI 0.8 protocol types (Apache 2.0).
 * Stripped of Lit dependencies; uses plain TypeScript.
 */

// ---------------------------------------------------------------------------
// Primitive value types
// ---------------------------------------------------------------------------

export interface StringValue {
  path?: string;
  literalString?: string;
  literal?: string;
}

export interface NumberValue {
  path?: string;
  literalNumber?: number;
  literal?: number;
}

export interface BooleanValue {
  path?: string;
  literalBoolean?: boolean;
  literal?: boolean;
}

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

export type DataValue =
  | string
  | number
  | boolean
  | null
  | DataObject
  | DataArray;

export type DataObject = { [key: string]: DataValue };
export type DataArray = DataValue[];

export interface ValueMap {
  key: string;
  valueString?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
  valueMap?: ValueMap[];
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export interface Action {
  name: string;
  context?: {
    key: string;
    value: {
      path?: string;
      literalString?: string;
      literalNumber?: number;
      literalBoolean?: boolean;
    };
  }[];
}

export interface UserAction {
  actionName: string;
  surfaceId: string;
  sourceComponentId: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Component property interfaces (raw / unresolved)
// ---------------------------------------------------------------------------

export interface TextProps {
  text: StringValue;
  usageHint?: "h1" | "h2" | "h3" | "h4" | "h5" | "caption" | "body";
}

export interface ImageProps {
  url: StringValue;
  usageHint?:
    | "icon"
    | "avatar"
    | "smallFeature"
    | "mediumFeature"
    | "largeFeature"
    | "header";
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export interface IconProps {
  name: StringValue;
}

export interface ButtonProps {
  child: AnyComponentNode;
  action: Action;
}

export interface DividerProps {
  axis?: "horizontal" | "vertical";
  color?: string;
  thickness?: number;
}

export interface CheckboxProps {
  label: StringValue;
  value: { path?: string; literalBoolean?: boolean };
}

export interface TextFieldProps {
  text?: StringValue;
  label: StringValue;
  type?: "shortText" | "number" | "date" | "longText";
  validationRegexp?: string;
}

export interface MultipleChoiceProps {
  selections: { path?: string; literalArray?: string[] };
  options?: {
    label: StringValue;
    value: string;
  }[];
  maxAllowedSelections?: number;
}

export interface SliderProps {
  value: { path?: string; literalNumber?: number };
  minValue?: number;
  maxValue?: number;
}

export interface TabItemProps {
  title: StringValue;
  child: AnyComponentNode;
}

// ---------------------------------------------------------------------------
// Resolved component node types (discriminated union)
// ---------------------------------------------------------------------------

interface BaseComponentNode {
  id: string;
  weight?: number | string;
  dataContextPath?: string;
}

export interface TextNode extends BaseComponentNode {
  type: "Text";
  properties: TextProps;
}

export interface ImageNode extends BaseComponentNode {
  type: "Image";
  properties: ImageProps;
}

export interface IconNode extends BaseComponentNode {
  type: "Icon";
  properties: IconProps;
}

export interface ButtonNode extends BaseComponentNode {
  type: "Button";
  properties: ButtonProps;
}

export interface RowNode extends BaseComponentNode {
  type: "Row";
  properties: {
    children: AnyComponentNode[];
    distribution?:
      | "start"
      | "center"
      | "end"
      | "spaceBetween"
      | "spaceAround"
      | "spaceEvenly";
    alignment?: "start" | "center" | "end" | "stretch";
  };
}

export interface ColumnNode extends BaseComponentNode {
  type: "Column";
  properties: {
    children: AnyComponentNode[];
    distribution?:
      | "start"
      | "center"
      | "end"
      | "spaceBetween"
      | "spaceAround"
      | "spaceEvenly";
    alignment?: "start" | "center" | "end" | "stretch";
  };
}

export interface CardNode extends BaseComponentNode {
  type: "Card";
  properties: {
    child?: AnyComponentNode;
    children: AnyComponentNode[];
  };
}

export interface ListNode extends BaseComponentNode {
  type: "List";
  properties: {
    children: AnyComponentNode[];
    direction?: "vertical" | "horizontal";
    alignment?: "start" | "center" | "end" | "stretch";
  };
}

export interface TabsNode extends BaseComponentNode {
  type: "Tabs";
  properties: {
    tabItems: TabItemProps[];
  };
}

export interface CheckboxNode extends BaseComponentNode {
  type: "CheckBox";
  properties: CheckboxProps;
}

export interface TextFieldNode extends BaseComponentNode {
  type: "TextField";
  properties: TextFieldProps;
}

export interface MultipleChoiceNode extends BaseComponentNode {
  type: "MultipleChoice";
  properties: MultipleChoiceProps;
}

export interface SliderNode extends BaseComponentNode {
  type: "Slider";
  properties: SliderProps;
}

export interface DividerNode extends BaseComponentNode {
  type: "Divider";
  properties: DividerProps;
}

export interface ModalNode extends BaseComponentNode {
  type: "Modal";
  properties: {
    entryPointChild: AnyComponentNode;
    contentChild: AnyComponentNode;
  };
}

export interface CustomNode extends BaseComponentNode {
  type: string;
  properties: Record<string, unknown>;
}

export type AnyComponentNode =
  | TextNode
  | ImageNode
  | IconNode
  | ButtonNode
  | RowNode
  | ColumnNode
  | CardNode
  | ListNode
  | TabsNode
  | CheckboxNode
  | TextFieldNode
  | MultipleChoiceNode
  | SliderNode
  | DividerNode
  | ModalNode
  | CustomNode;

// ---------------------------------------------------------------------------
// Wire-format messages (Server → Client)
// ---------------------------------------------------------------------------

export interface ComponentArrayReference {
  explicitList?: string[];
  template?: { componentId: string; dataBinding: string };
}

export interface ComponentInstance {
  id: string;
  weight?: number;
  component?: Record<string, unknown>;
}

export interface BeginRenderingMessage {
  surfaceId: string;
  root: string;
  styles?: Record<string, string>;
}

export interface SurfaceUpdateMessage {
  surfaceId: string;
  components: ComponentInstance[];
}

export interface DataModelUpdate {
  surfaceId: string;
  path?: string;
  contents: ValueMap[];
}

export interface DeleteSurfaceMessage {
  surfaceId: string;
}

export interface ServerToClientMessage {
  beginRendering?: BeginRenderingMessage;
  surfaceUpdate?: SurfaceUpdateMessage;
  dataModelUpdate?: DataModelUpdate;
  deleteSurface?: DeleteSurfaceMessage;
}

// ---------------------------------------------------------------------------
// Surface (processed state)
// ---------------------------------------------------------------------------

export interface Surface {
  id: string;
  rootComponentId: string | null;
  componentTree: AnyComponentNode | null;
  dataModel: Record<string, DataValue>;
  components: Map<string, ComponentInstance>;
  styles: Record<string, string>;
}
