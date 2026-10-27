import type { SectionName } from "../../page/buildPage";

// See index.ts for what each field means.
export interface Anchor {
  section: SectionName;
  row?: number;
  col?: number;
  from?: "left" | "center" | "right";
}

export interface Art {
  at: Anchor;
  lines: string[];
}

export interface Level {
  name: string;
  slot?: string[];
  art?: Art[];
  tee?: Anchor;
  cup: Anchor;
}
