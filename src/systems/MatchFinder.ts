import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';
import { Match, MatchShape } from '@/model/Match';

export class MatchFinder {
  find(board: Board): Match[] {
    const rawHorizontals: Gem[][] = [];
    const rawVerticals: Gem[][] = [];

    for (let r = 0; r < board.rows; r++) {
      let chain: Gem[] = [];
      for (let c = 0; c < board.cols; c++) {
        const gem = board.get(r, c);
        if (gem && (chain.length === 0 || chain[0].type === gem.type)) {
          chain.push(gem);
        } else {
          if (chain.length >= 3) rawHorizontals.push([...chain]);
          chain = gem ? [gem] : [];
        }
      }
      if (chain.length >= 3) rawHorizontals.push([...chain]);
    }

    for (let c = 0; c < board.cols; c++) {
      let chain: Gem[] = [];
      for (let r = 0; r < board.rows; r++) {
        const gem = board.get(r, c);
        if (gem && (chain.length === 0 || chain[0].type === gem.type)) {
          chain.push(gem);
        } else {
          if (chain.length >= 3) rawVerticals.push([...chain]);
          chain = gem ? [gem] : [];
        }
      }
      if (chain.length >= 3) rawVerticals.push([...chain]);
    }

    if (rawHorizontals.length === 0 && rawVerticals.length === 0) {
      return [];
    }

    const matches: Match[] = [];
    const processedGems = new Set<number>();

    for (const hLine of rawHorizontals) {
      for (const vLine of rawVerticals) {

        const intersection = hLine.find(hGem => vLine.some(vGem => vGem.id === hGem.id));
        if (intersection && !processedGems.has(intersection.id)) {
          const combinedMap = new Map<number, Gem>();
          hLine.forEach(g => combinedMap.set(g.id, g));
          vLine.forEach(g => combinedMap.set(g.id, g));

          const combinedGems = Array.from(combinedMap.values());
          combinedGems.forEach(g => processedGems.add(g.id));

          let shape: MatchShape = 'L';
          if (hLine.length >= 3 && vLine.length >= 3) {
            shape = hLine.length === 3 && vLine.length === 3 ? 'L' : 'T';
            if (combinedGems.length >= 6) shape = 'cross';
          }

          matches.push({
            gems: combinedGems,
            shape,
            centerGem: intersection,
          });
        }
      }
    }

    for (const hLine of rawHorizontals) {
      const unprocessed = hLine.filter(g => !processedGems.has(g.id));
      if (unprocessed.length >= 3) {
        hLine.forEach(g => processedGems.add(g.id));
        let shape: MatchShape = '3-row';
        if (hLine.length === 4) shape = '4-row';
        if (hLine.length >= 5) shape = '5-row';

        matches.push({
          gems: hLine,
          shape,
          centerGem: hLine[Math.floor(hLine.length / 2)],
        });
      }
    }

    for (const vLine of rawVerticals) {
      const unprocessed = vLine.filter(g => !processedGems.has(g.id));
      if (unprocessed.length >= 3) {
        vLine.forEach(g => processedGems.add(g.id));
        let shape: MatchShape = '3-row';
        if (vLine.length === 4) shape = '4-row';
        if (vLine.length >= 5) shape = '5-row';

        matches.push({
          gems: vLine,
          shape,
          centerGem: vLine[Math.floor(vLine.length / 2)],
        });
      }
    }

    return matches;
  }

  hasMatches(board: Board): boolean {
    return this.find(board).length > 0;
  }
}