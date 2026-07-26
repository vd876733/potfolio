import * as THREE from 'three';

export function createNoiseTexture() {
  if (typeof document === 'undefined') return null; // Handle SSR
  
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  
  if (context) {
    for (let x = 0; x < 512; x++) {
      for (let y = 0; y < 512; y++) {
        const v = Math.floor(Math.random() * 255);
        context.fillStyle = `rgb(${v},${v},${v})`;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}
