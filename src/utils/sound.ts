// Futuristic Web Audio API Sound Synthesizer Utility
// Requires zero asset loading, ensuring instant play times and no missing file issues.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Standard AudioContext initialization
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// Global toggle for sounds (can be expanded if we want a mute button)
let soundsMuted = false;

export const muteSounds = () => { soundsMuted = true; };
export const unmuteSounds = () => { soundsMuted = false; };
export const isMuted = () => soundsMuted;

/**
 * Play a high-quality futuristic click/pop sound
 */
export function playClickSound() {
  if (soundsMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security autoplays)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // Create nodes
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Settings
  osc.type = "sine";
  
  // Frequency envelope: rapid sweep down for a "pop" sensation
  osc.frequency.setValueAtTime(850, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

  // Gain envelope: fast attack, rapid decay
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.002); // very quick attack
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  // Play and clean up
  osc.start(now);
  osc.stop(now + 0.09);
}

/**
 * Play a very subtle high-frequency interface tick (hover)
 */
export function playHoverSound() {
  if (soundsMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  
  // Tiny high chirp
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);

  // Very quiet so it doesn't become annoying
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.02, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.start(now);
  osc.stop(now + 0.04);
}

/**
 * Play a pleasant futuristic two-tone success chord
 */
export function playSuccessSound() {
  if (soundsMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  const playTone = (freq: number, startOffset: number, duration: number, volume: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + startOffset);

    gain.gain.setValueAtTime(0.001, now + startOffset);
    gain.gain.linearRampToValueAtTime(volume, now + startOffset + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration - 0.01);

    osc.start(now + startOffset);
    osc.stop(now + startOffset + duration);
  };

  // Modern major third upward chime
  playTone(523.25, 0, 0.12, 0.06);     // C5
  playTone(659.25, 0.06, 0.20, 0.06);    // E5
}
