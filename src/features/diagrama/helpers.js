import { overlaysPath } from "../../util";

export function createDataOverlay(image, xOffset, yOffset, tooltip, alignment) {
  return {
    pathImage: `${overlaysPath}/${image}`,
    offset: { x: xOffset, y: yOffset },
    tooltip,
    alignment
  }
}


