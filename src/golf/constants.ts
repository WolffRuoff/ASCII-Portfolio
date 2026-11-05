// How the ball plays. Speeds are in px/s.
/** Longest drag that still adds power, in px. */
export const MAX_DRAG = 150;
/** Launch speed per px of drag. */
export const POWER = 6;
/** Shorter drags are ignored, in px. */
export const MIN_DRAG = 4;
/** Speed lost per second, as an exponential decay rate. */
export const FRICTION = 1.5;
/** Share of speed kept after hitting a wall. */
export const BOUNCE = 0.8;
/** The ball stops below this speed. */
export const STOP_SPEED = 15;
/** Fastest a moving wall knocks the ball. */
export const MAX_PUSH = 500;
/** Distance from the cup, in columns, at which the flag is pulled. */
export const PIN_RADIUS = 8;

// The page and levels.
/** About how many times taller a cell is than wide. */
export const CELL_ASPECT = 2;
/** How long each frame of a level's animation shows, in ms. */
export const FRAME_TIME = 200;
