import bumpers from "./bumpers";
import corner from "./corner";
import green from "./green";
import type { Level } from "./types";

/**
 * Play order. To add a level, write its file and list it here. See `Level` for
 * the format.
 */
export const LEVELS: Level[] = [green, corner, bumpers];
