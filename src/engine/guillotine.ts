import { Item, PlacedItem, BinResult, Bin } from './types';

// A mock implementation of a guillotine bin packing algorithm
// In a real implementation this would use complex heuristics like MaxRects or Guillotine split

export function optimize(items: Item[], bins: Bin[], bladeWidth: number = 4): BinResult[] {
  const results: BinResult[] = [];
  let currentItems = [...items];

  // Try to fit anything in a naive way just to mock real structure
  for (const bin of bins) {
    if (currentItems.length === 0) break;
    
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    
    const placedItems: PlacedItem[] = [];
    const remainingItems: Item[] = [];

    for (const item of currentItems) {
      if (currentX + item.w <= bin.w && currentY + item.h <= bin.h) {
        placedItems.push({
          ...item,
          x: currentX,
          y: currentY,
          rotated: false
        });
        currentX += item.w + bladeWidth;
        rowHeight = Math.max(rowHeight, item.h);
      } else if (currentX === 0 || currentY + rowHeight + bladeWidth + item.h <= bin.h) {
        // Next row
        if (currentX > 0) {
          currentY += rowHeight + bladeWidth;
        }
        currentX = 0;
        if (currentY + item.h <= bin.h && item.w <= bin.w) {
            placedItems.push({
                ...item,
                x: currentX,
                y: currentY,
                rotated: false
            });
            currentX += item.w + bladeWidth;
            rowHeight = item.h;
        } else {
            remainingItems.push(item);
        }
      } else {
        remainingItems.push(item);
      }
    }

    const usedArea = placedItems.reduce((acc, i) => acc + (i.w * i.h), 0);
    const binArea = bin.w * bin.h;

    const freeSpaces: Bin[] = [];
    const maxUsedY = placedItems.reduce((acc, i) => Math.max(acc, i.y + i.h), 0);
    if (bin.h - maxUsedY > 150) {
      // Useful large piece at the bottom
      freeSpaces.push({ w: bin.w, h: bin.h - maxUsedY });
    }

    results.push({
      bin,
      items: placedItems,
      utilization: usedArea / binArea,
      freeSpaces
    });

    currentItems = remainingItems;
  }

  return results;
}
