type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type Alignment = "start" | "end";
export type Side = "top" | "bottom" | "left" | "right";
export type AlignedPlacement = `${Side}-${Alignment}`;
export type Placement = Prettify<Side | AlignedPlacement>;
export type Coords = { x: number; y: number };
export type Dimensions = { width: number; height: number };
export type Rect = Prettify<Coords & Dimensions>;

export interface ElementRects {
  reference: Rect;
  floating: Rect;
}

