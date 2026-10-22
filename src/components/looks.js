/**
 * Named looks for the three.js scenes (Geary + roulette wheel), from fully 3D
 * towards flat 2D. Change DEFAULT_LOOK to switch, or preview with ?look=<name>.
 *
 *   shading     – 'standard' (lit, physically based) or 'toon' (flat cel bands)
 *   bands       – toon only: how many tones each colour is shaded in
 *   shade       – toon only: brightness of the darkest tone, 0..1 (1 = no shading)
 *   fill        – extra flat ambient light (toon has no reflections to brighten it)
 *   gloss       – 0..1, how shiny/reflective the standard materials are
 *   outline     – ink outline thickness, 0 for none
 *   depth       – how thick Geary is (1 = full)
 *   tilt        – how far Geary turns towards the pointer / sways (1 = full)
 *   wheelHeight – vertical scale of the wheel (1 = full)
 */
export const LOOKS = {
  full: { shading: 'standard', gloss: 1, outline: 0, depth: 1, tilt: 1, wheelHeight: 1 },
  satin: { shading: 'standard', gloss: 0.35, outline: 0, depth: 0.6, tilt: 0.6, wheelHeight: 0.7 },
  cel: { shading: 'toon', bands: 3, shade: 0.35, fill: 0.5, outline: 0.004, depth: 0.4, tilt: 0.4, wheelHeight: 0.5 },
  paper: { shading: 'toon', bands: 2, shade: 0.75, fill: 0.7, outline: 0.007, depth: 0.2, tilt: 0.25, wheelHeight: 0.3 },
}

export const DEFAULT_LOOK = 'cel'

export function getLook() {
  let name = DEFAULT_LOOK
  try {
    name = new URLSearchParams(window.location.search).get('look') || DEFAULT_LOOK
  } catch {}
  return LOOKS[name] || LOOKS[DEFAULT_LOOK]
}

/**
 * Materials, lights + render for a look. `mat(color, opts)` takes
 * MeshStandardMaterial options; pass `outline: false` to keep small details
 * free of ink lines. Call `light(scene)` once after adding the scene's own lights.
 */
export async function lookKit(THREE, renderer, look) {
  const lerp = (a, b, t) => a + (b - a) * t

  let gradientMap = null
  if (look.shading === 'toon') {
    const n = look.bands
    const tones = Array.from({ length: n }, (_, i) => Math.round(255 * lerp(look.shade, 1, n > 1 ? i / (n - 1) : 1)))
    gradientMap = new THREE.DataTexture(new Uint8Array(tones), n, 1, THREE.RedFormat)
    gradientMap.minFilter = gradientMap.magFilter = THREE.NearestFilter
    gradientMap.needsUpdate = true
  }

  const mat = (color, { outline, metalness = 0, roughness = 0.5, envMapIntensity = 1, ...o } = {}) => {
    const m = gradientMap
      ? new THREE.MeshToonMaterial({ color, gradientMap, ...o })
      : new THREE.MeshStandardMaterial({
          color,
          ...o,
          metalness: metalness * look.gloss,
          roughness: lerp(0.9, roughness, look.gloss),
          envMapIntensity: envMapIntensity * look.gloss,
        })
    if (outline === false) m.userData.outlineParameters = { visible: false }
    return m
  }

  const light = (scene) => {
    if (look.fill) scene.add(new THREE.AmbientLight(0xffffff, look.fill))
  }

  let effect = null
  if (look.outline > 0) {
    const { OutlineEffect } = await import('three/examples/jsm/effects/OutlineEffect.js')
    effect = new OutlineEffect(renderer, { defaultThickness: look.outline, defaultColor: [0.1, 0.02, 0.03] })
  }

  return {
    mat,
    light,
    render: (scene, camera) => (effect || renderer).render(scene, camera),
    dispose: () => gradientMap?.dispose(),
  }
}
