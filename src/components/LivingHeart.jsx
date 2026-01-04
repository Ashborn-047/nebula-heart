import { useRef, useEffect, useState } from 'react';
import { noise3D } from '../utils/noise';
import { THEMES, RARE_THEME, CONFIG } from '../constants/themes';

/**
 * LivingHeart Component
 * Renders an animated organic nebula with pulsating effects and dynamic color transitions
 */
const LivingHeart = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

    // Handle responsive sizing
    useEffect(() => {
        const updateDimensions = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            // Use smaller dimension to ensure heart fits, with padding
            const maxSize = Math.min(vw * 0.9, vh * 0.75, 600);
            const size = Math.max(280, maxSize); // Minimum 280px for very small screens
            setDimensions({ width: size, height: size });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas resolution (2x for retina displays)
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const canvasSize = dimensions.width;
        canvas.width = canvasSize * dpr;
        canvas.height = canvasSize * dpr;
        ctx.scale(dpr, dpr);

        // Get configuration values
        const {
            POINTS,
            NOISE_SCALE,
            NOISE_AMP,
            TISSUE_LAYERS,
            BEAT_POWER,
            BEAT_SPEED,
            SHOCKWAVE_CONTOUR_COUNT,
            SHOCKWAVE_SPACING,
            RARE_THEME_CHANCE
        } = CONFIG;

        // Scale radius based on canvas size (responsive)
        const scaleFactor = canvasSize / 600; // 600 is our reference size
        const BASE_RADIUS = CONFIG.BASE_RADIUS * scaleFactor;
        const SCALED_NOISE_AMP = NOISE_AMP * scaleFactor;

        const CENTER_X = canvasSize / 2;
        const CENTER_Y = canvasSize / 2;

        // Shockwave State
        let shockwaves = [];
        let isShockwaveActive = false;

        // Color State
        let themeIndex = 0;
        let targetTheme = THEMES[0];
        let currentHue = THEMES[0].hue;
        let currentSat = THEMES[0].sat;
        let currentLight = THEMES[0].light;

        // Timing
        let startTime = Date.now();

        // Cache Arrays
        const noiseCache = new Float32Array(POINTS + 1);

        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

        // --- HELPER FUNCTIONS ---

        const drawCachedOrganicPath = (ctx, scale, points, radius, cx, cy, nAmp, cache, rotationOffset = 0) => {
            const offsetInt = Math.floor(rotationOffset) % points;
            for (let i = 0; i <= points; i++) {
                let index = (i + offsetInt);
                if (index > points) index -= points;
                const nValue = cache[index];
                const angle = (i / points) * Math.PI * 2;
                const r = (radius + (nValue * nAmp)) * scale;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        };

        const drawOrganicPath = (ctx, time, scale, points, radius, cx, cy, nScale, nAmp, seedOffset) => {
            ctx.beginPath();
            const noiseSpeed = time * 0.5;
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const nx = Math.cos(angle) * nScale + noiseSpeed;
                const ny = Math.sin(angle) * nScale + seedOffset;
                const nz = time * 0.3;
                const n1 = noise3D(nx, ny, nz);
                const n2 = noise3D(nx * 2, ny * 2, nz);
                const nValue = n1 + (n2 * 0.5);
                const r = (radius + (nValue * nAmp)) * scale;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        };

        const drawDustParticles = (ctx, time, cx, cy, scale) => {
            const count = 30;
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 4 + (time * 0.1);
                const r = (130 * 0.8) * scale * (Math.sin(i + time * 0.2) * 0.5 + 0.5);
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                ctx.beginPath();
                const size = Math.random() * 1.5;
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
        };

        const drawSoftHighlights = (ctx, time, scale, points, radius, cx, cy, nScale, nAmp, hue) => {
            const noiseSpeed = time * 0.6;
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < points; i += 4) {
                const angle = (i / points) * Math.PI * 2;
                const nx = Math.cos(angle) * nScale + noiseSpeed;
                const ny = Math.sin(angle);
                const nValue = noise3D(nx, ny, time * 0.3);
                const r = (radius + (nValue * nAmp)) * scale;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;

                if (nValue > 0.65) {
                    const size = 20 * (nValue - 0.65);
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue}, 50%, 90%, ${nValue * 0.2})`;
                    ctx.fill();
                }
            }
            ctx.restore();
        };

        // --- MAIN RENDER LOOP ---

        const render = () => {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000;

            // 1. PHYSICS & BEAT CALC
            const rawSin = Math.sin(elapsed * BEAT_SPEED);
            const beatIntensity = Math.pow((rawSin + 1) / 2, BEAT_POWER);
            const expansion = 1 + (beatIntensity * 0.12);

            // 2. COLOR INTERPOLATION
            currentHue = lerp(currentHue, targetTheme.hue, 0.05);
            currentSat = lerp(currentSat, targetTheme.sat, 0.05);
            currentLight = lerp(currentLight, targetTheme.light, 0.05);

            // 3. PRE-CALCULATE NOISE
            const noiseSpeed = elapsed * 0.6;
            const nz = elapsed * 0.3;

            for (let i = 0; i <= POINTS; i++) {
                const angle = (i / POINTS) * Math.PI * 2;
                const nx1 = Math.cos(angle) * NOISE_SCALE + noiseSpeed;
                const ny1 = Math.sin(angle) * NOISE_SCALE;
                const n1 = noise3D(nx1, ny1, nz);
                const nx2 = Math.cos(angle) * (NOISE_SCALE * 2) + noiseSpeed;
                const ny2 = Math.sin(angle) * (NOISE_SCALE * 2);
                const n2 = noise3D(nx2, ny2, nz + 10);
                noiseCache[i] = n1 + (n2 * 0.5);
            }

            // 4. SHOCKWAVE SPAWN & COLOR CYCLE
            if (beatIntensity > 0.96 && !isShockwaveActive) {
                // Cycle color on pulse
                if (Math.random() < RARE_THEME_CHANCE) {
                    targetTheme = RARE_THEME;
                } else {
                    themeIndex = (themeIndex + 1) % THEMES.length;
                    targetTheme = THEMES[themeIndex];
                }

                shockwaves.push({
                    startTime: now,
                    opacity: 1,
                    scale: 1,
                    rotationOffset: Math.random() * 10,
                    hue: currentHue,
                    sat: currentSat,
                    light: currentLight
                });
                isShockwaveActive = true;
            }
            if (beatIntensity < 0.8) isShockwaveActive = false;

            // 5. CLEAR
            ctx.clearRect(0, 0, canvasSize, canvasSize);

            // 6. DRAW SHOCKWAVES
            shockwaves = shockwaves.filter(wave => wave.opacity > 0);
            shockwaves.forEach(wave => {
                const waveAge = (now - wave.startTime) / 1000;
                const waveProgress = waveAge * 0.8;

                wave.scale = 1 + (waveProgress * 3.0);
                const remaining = 1 - waveProgress;
                wave.opacity = remaining > 0 ? remaining * remaining * remaining : 0;

                if (wave.opacity > 0) {
                    ctx.save();
                    ctx.globalCompositeOperation = 'screen';

                    const distortionMultiplier = 1.0 + (waveProgress * 2.0);

                    for (let i = 0; i < SHOCKWAVE_CONTOUR_COUNT; i++) {
                        const lineOffset = i * (SHOCKWAVE_SPACING * wave.scale);
                        const lineScaleMultiplier = (BASE_RADIUS * wave.scale + lineOffset) / (BASE_RADIUS * wave.scale);
                        const finalScale = wave.scale * lineScaleMultiplier;
                        const hierarchyPos = i / SHOCKWAVE_CONTOUR_COUNT;

                        const wHue = wave.hue;
                        const wSat = wave.sat;
                        const lightness = 95 - (hierarchyPos * (95 - wave.light));
                        const alpha = wave.opacity * (1 - (hierarchyPos * 0.8));

                        ctx.beginPath();
                        drawCachedOrganicPath(ctx, finalScale, POINTS, BASE_RADIUS, CENTER_X, CENTER_Y, SCALED_NOISE_AMP * distortionMultiplier, noiseCache, wave.rotationOffset);

                        ctx.lineWidth = 1.5 + (i * 0.8);
                        ctx.strokeStyle = `hsla(${wHue}, ${wSat}%, ${lightness}%, ${alpha * 0.5})`;

                        if (alpha > 0.02) {
                            ctx.shadowColor = `hsla(${wHue}, ${wSat}%, 75%, ${alpha})`;
                            ctx.shadowBlur = 5 + (i * 8);
                        }

                        ctx.stroke();
                    }
                    ctx.restore();
                }
            });

            // 7. DRAW ORGANIC NEBULA CORE

            // Layer A: Deep Diffusion
            ctx.save();
            ctx.beginPath();
            drawCachedOrganicPath(ctx, expansion, POINTS, BASE_RADIUS, CENTER_X, CENTER_Y, SCALED_NOISE_AMP, noiseCache, 0);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.shadowColor = `hsla(${currentHue}, ${currentSat}%, 60%, 0.6)`;
            ctx.shadowBlur = 60;
            ctx.fill();
            ctx.restore();

            // Layer B: Main Body
            ctx.save();
            ctx.beginPath();
            drawCachedOrganicPath(ctx, expansion * 0.95, POINTS, BASE_RADIUS, CENTER_X, CENTER_Y, SCALED_NOISE_AMP, noiseCache, 0);

            const baseGrad = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, BASE_RADIUS * 1.3);
            baseGrad.addColorStop(0, `hsla(${currentHue}, ${currentSat - 20}%, 90%, 1)`);
            baseGrad.addColorStop(0.3, `hsla(${currentHue}, ${currentSat}%, ${currentLight}%, 1)`);
            baseGrad.addColorStop(0.8, `hsla(${currentHue}, ${currentSat}%, 20%, 1)`);
            baseGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');

            ctx.fillStyle = baseGrad;
            ctx.fill();
            ctx.restore();

            // Layer C: Internal Gas Layers
            for (let i = 1; i <= TISSUE_LAYERS; i++) {
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                const layerScale = 1.0 - (i * 0.12);
                const layerTime = elapsed * (0.8 + i * 0.4);
                const layerNoiseOffset = i * 200;

                const layerHue = i % 2 === 0 ? currentHue : currentHue + 20;
                const layerColor = `hsla(${layerHue}, ${currentSat}%, 70%, 1)`;

                drawOrganicPath(ctx, layerTime, expansion * layerScale, POINTS, BASE_RADIUS, CENTER_X, CENTER_Y, NOISE_SCALE * 2.5, SCALED_NOISE_AMP * 1.2, layerNoiseOffset);

                ctx.fillStyle = layerColor;
                ctx.globalAlpha = 0.08;
                ctx.shadowColor = layerColor;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();
            }

            // Layer D: Texture
            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = 0.3;
            drawDustParticles(ctx, elapsed, CENTER_X, CENTER_Y, expansion);
            ctx.restore();

            // Layer E: Highlights
            drawSoftHighlights(ctx, elapsed, expansion, POINTS, BASE_RADIUS, CENTER_X, CENTER_Y, NOISE_SCALE, SCALED_NOISE_AMP, currentHue);

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 overflow-hidden relative selection:bg-purple-500/30 px-4"
        >
            {/* UI Overlay */}
            <div className="absolute top-4 sm:top-8 text-center z-10 space-y-1 sm:space-y-2 pointer-events-none select-none px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-widest opacity-90 uppercase drop-shadow-[0_0_15px_rgba(216,180,254,0.5)]">
                    Organic Nebula
                </h1>
                <p className="text-purple-300/60 text-xs sm:text-sm tracking-wide font-mono">
                    Dynamic Chroma Core
                </p>
            </div>

            <canvas
                ref={canvasRef}
                style={{
                    width: dimensions.width,
                    height: dimensions.height
                }}
                className="max-w-full"
            />

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(30,27,75,0.4)_0%,_rgba(0,0,0,0)_70%)]"></div>
        </div>
    );
};

export default LivingHeart;
