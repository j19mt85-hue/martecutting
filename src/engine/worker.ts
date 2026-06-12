import { EngineRequest, EngineResponse } from './types';
import { optimize } from './guillotine';

self.onmessage = (e: MessageEvent<EngineRequest>) => {
  const start = performance.now();
  const { items, bins, bladeWidth } = e.data;

  // Flatten qty for engine calculation
  const mappedItems = items.flatMap(i => {
     // Usually qty is handled before calling worker or inside worker, but we assume items are already flattened.
     return [i];
  });

  const results = optimize(mappedItems, bins, bladeWidth);

  // Collect unplaced
  const placedIds = new Set(results.flatMap(r => r.items.map(i => i.id)));
  const unplaced = items.filter(i => !placedIds.has(i.id));

  const totalArea = results.reduce((acc, r) => acc + (r.bin.w * r.bin.h), 0);
  const usedArea = results.reduce((acc, r) => acc + (r.utilization * r.bin.w * r.bin.h), 0);
  const totalUtilization = totalArea > 0 ? usedArea / totalArea : 0;

  const response: EngineResponse = {
    results,
    unplaced,
    totalUtilization,
    timeMs: performance.now() - start
  };

  self.postMessage(response);
};
