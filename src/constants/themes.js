/**
 * Color Theme Definitions
 * HSL-based color themes for the nebula animation
 */

// Main color themes - cycles through Pink -> Purple -> Violet -> Blue/Purple
export const THEMES = [
    { hue: 340, sat: 90, light: 60, name: 'Soft Red' },       // Pink/Red
    { hue: 280, sat: 85, light: 60, name: 'Purple' },         // Purple
    { hue: 260, sat: 90, light: 65, name: 'Violet' },         // Violet
    { hue: 240, sat: 80, light: 65, name: 'Bluish Purple' },  // Indigo
];

// Rare emerald theme - 5% chance to appear
export const RARE_THEME = {
    hue: 150,
    sat: 80,
    light: 50,
    name: 'Emerald'
};

// Configuration constants
export const CONFIG = {
    // Core geometry
    POINTS: 140,
    BASE_RADIUS: 130,

    // Organic noise parameters
    NOISE_SCALE: 1.8,
    NOISE_AMP: 20,
    TISSUE_LAYERS: 6,

    // Heartbeat parameters
    BEAT_POWER: 12,
    BEAT_SPEED: 3.5,

    // Shockwave parameters
    SHOCKWAVE_CONTOUR_COUNT: 8,
    SHOCKWAVE_SPACING: 4.0,

    // Rare theme probability
    RARE_THEME_CHANCE: 0.05
};
