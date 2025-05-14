import type { Coords, ElementRects, Placement, Side } from "./types";

export function getSide(placement: Placement): Side {
    return placement.split('-')[0] as Side;
}

export const calculateCoordsFromPlacement = ({ reference, floating }: ElementRects, placement: Placement, offset: number) => {
    let coords: Coords;
    switch (placement) {
        case 'top': {
            coords = { x: 0, y: 0 - floating.height - offset };
            break;
        }
        case 'bottom':
            coords = { x: 0, y: reference.height + offset };
            break;
        case 'right':
            coords = { x: reference.width + offset, y: 0 - floating.height / 2 };
            break;
        case 'left':
            coords = { x: 0 - floating.width - offset, y: 0 - floating.height / 2 };
            break;
        default:
            coords = { x: reference.x, y: reference.y };
    }

    return coords;
}