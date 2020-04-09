import Player from "../player/Player";

export default (p: Player<any>, players: Player<any>[], colRadius: number) => {
  players.forEach((it) => {
    if (it !== p && it.location.distance(p.location) < colRadius * 2) {
      const newLoc = it.location
        .sub(p.location)
        .normalize()
        .mult(colRadius * 2);
      p.x = it.location.x - newLoc.x;
      p.y = it.location.y - newLoc.y;
    }
  });
};
