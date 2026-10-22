import { useEffect, useRef } from 'react'
import { getLook, lookKit } from './looks'

/**
 * Geary built in three.js: a metal gear, a grey dome head and a tuxedo body,
 * laid out from geary-happy.png (666 × 691 px). He tilts towards the pointer and
 * sways on his own. The canvas overhangs his box so he isn't clipped as he turns.
 */
const RAD = Math.PI / 180
const IMG_W = 666
const IMG_H = 691
const OVERHANG = 0.18 // canvas extends this fraction past each side of his box

// image pixels → model units (2 units across, origin at the image centre)
const S = IMG_W / 2
const px = (x, y) => [(x - IMG_W / 2) / S, (IMG_H / 2 - y) / S]

export default function GearyModel({ onFail }) {
  const hostRef = useRef(null)

  useEffect(() => {
    let dead = false
    let cleanup = () => {}

    ;(async () => {
      try {
        const THREE = await import('three')
        const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
        if (dead) return
        const host = hostRef.current

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
        host.appendChild(renderer.domElement)

        const look = getLook()
        const { mat, light, render, dispose: disposeLook } = await lookKit(THREE, renderer, look)
        const scene = new THREE.Scene()
        const pmrem = new THREE.PMREMGenerator(renderer)
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
        scene.environment = envTex
        scene.environmentIntensity = 0.3

        scene.add(new THREE.AmbientLight(0xffe2cf, 0.45))
        const key = new THREE.DirectionalLight(0xfff0dd, 1.3)
        key.position.set(-2, 3, 4)
        scene.add(key)
        const rim = new THREE.PointLight(0xe33148, 5, 8)
        rim.position.set(2, 0.5, 1.2)
        scene.add(rim)
        light(scene)

        const camera = new THREE.PerspectiveCamera(26, IMG_W / IMG_H, 0.1, 50)
        const viewH = (IMG_H / S) * (1 + OVERHANG * 2)
        camera.position.set(0, 0, viewH / 2 / Math.tan((camera.fov * RAD) / 2))
        camera.lookAt(0, 0, 0)

        // ───────── materials
        const gearM = mat(0x9a9ea4, { metalness: 0.55, roughness: 0.38 })
        const headM = mat(0x666666, { roughness: 0.42 })
        const jacketM = mat(0x2a2a2a, { roughness: 0.55 })
        const lapelM = mat(0x111111, { roughness: 0.35 })
        const shirtM = mat(0xd4d4d4, { roughness: 0.75 })
        const stripeM = mat(0x9a9da1, { roughness: 0.6, outline: false })
        const inkM = mat(0x050505, { roughness: 0.2, outline: false })
        const cheekM = mat(0xd98a92, { roughness: 0.8, outline: false })
        const bowM = mat(0xb3121f, { roughness: 0.35, metalness: 0.1 })
        const buttonM = mat(0xcfcfcf, { roughness: 0.3, outline: false })

        const geary = new THREE.Group()
        geary.scale.z = look.depth
        scene.add(geary)

        // flat outline in image pixels → bevelled slab from z0 to z0 + depth
        const slab = (pts, z0, depth, m, bevel = 0.025) => {
          const sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(...px(x, y))))
          const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4, curveSegments: 24 })
          const mesh = new THREE.Mesh(g, m)
          mesh.position.z = z0
          geary.add(mesh)
          return mesh
        }
        const mirror = (pts) => pts.map(([x, y]) => [IMG_W - x, y]).reverse()

        // ───────── the gear, behind everything
        {
          const [cx, cy] = px(333, 330)
          const R = 335 / S
          const r = 270 / S
          const sh = new THREE.Shape()
          for (let k = 0; k < 8; k++) {
            const a = 22.5 + 45 * k
            ;[[r, a - 13], [R, a - 9], [R, a + 9], [r, a + 13]].forEach(([rad, ang], i) => {
              const x = cx + rad * Math.sin(ang * RAD)
              const y = cy + rad * Math.cos(ang * RAD)
              k === 0 && i === 0 ? sh.moveTo(x, y) : sh.lineTo(x, y)
            })
          }
          sh.closePath()
          const g = new THREE.ExtrudeGeometry(sh, { depth: 0.16, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4 })
          const gear = new THREE.Mesh(g, gearM)
          gear.position.z = -0.2
          geary.add(gear)
        }

        // ───────── head: a flattened dome sitting in the collar
        const [hx, hy] = px(333, 330)
        const HR = 215 / S
        const HZ = 0.04
        const HD = 0.34 // dome depth
        const head = new THREE.Mesh(new THREE.SphereGeometry(HR, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2 + 0.08), headM)
        head.scale.z = HD / HR
        head.position.set(hx, hy, HZ)
        geary.add(head)

        // place a mesh on the dome's surface, facing outwards
        const zAxis = new THREE.Vector3(0, 0, 1)
        const onHead = (mesh, x, y, lift = 0) => {
          const [mx, my] = px(x, y)
          const dx = mx - hx
          const dy = my - hy
          const k = Math.sqrt(Math.max(0, 1 - (dx * dx + dy * dy) / (HR * HR)))
          const n = new THREE.Vector3(dx / (HR * HR), dy / (HR * HR), k / HD).normalize()
          mesh.position.set(mx, my, HZ + HD * k).addScaledVector(n, lift)
          mesh.quaternion.setFromUnitVectors(zAxis, n)
          geary.add(mesh)
          return mesh
        }
        const eyeGeo = new THREE.CapsuleGeometry(0.04, 0.075, 8, 16)
        for (const x of [262, 404]) {
          const eye = new THREE.Mesh(eyeGeo, inkM)
          eye.scale.z = 0.45
          onHead(eye, x, 272, 0.005)
        }
        const cheekGeo = new THREE.SphereGeometry(0.042, 24, 12)
        for (const [x, y] of [[215, 298], [440, 302]]) {
          const cheek = new THREE.Mesh(cheekGeo, cheekM)
          cheek.scale.z = 0.25
          onHead(cheek, x, y, 0.002)
        }
        const smile = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.0065, 8, 32, Math.PI * 0.8), inkM)
        onHead(smile, 333, 302, 0.004)
        smile.rotateZ(Math.PI + Math.PI * 0.1)

        // ───────── sleeves (white, with a grey stripe) poking out either side
        const sleeve = [[65, 320], [128, 320], [128, 520], [15, 535], [0, 420], [50, 370]]
        const stripe = [[42, 380], [60, 370], [112, 520], [92, 524]]
        for (const flip of [false, true]) {
          slab(flip ? mirror(sleeve) : sleeve, 0.02, 0.18, shirtM)
          slab(flip ? mirror(stripe) : stripe, 0.24, 0.01, stripeM, 0.006)
          const cuff = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 8), inkM)
          const [cx, cy] = px(flip ? IMG_W - 88 : 88, 515)
          cuff.position.set(cx, cy, 0.25)
          geary.add(cuff)
        }

        // ───────── jacket, shirt, lapels
        const JZ = 0.08
        const JD = 0.28
        const front = JZ + JD + 0.025
        slab([[115, 335], [551, 335], [552, 560], [525, 578], [522, 688], [368, 688], [333, 640], [298, 688], [150, 688], [148, 578], [116, 560]], JZ, JD, jacketM, 0.04)
        slab([[198, 338], [468, 338], [400, 470], [333, 530], [266, 470]], front, 0.012, shirtM, 0.008)
        slab([[160, 345], [198, 338], [270, 470], [333, 535], [305, 600], [240, 520], [175, 420]], front + 0.02, 0.012, lapelM, 0.01)
        slab(mirror([[160, 345], [198, 338], [270, 470], [333, 535], [305, 600], [240, 520], [175, 420]]), front + 0.02, 0.012, lapelM, 0.01)

        const btnGeo = new THREE.SphereGeometry(0.012, 12, 8)
        for (const y of [410, 440, 470, 500]) {
          const b = new THREE.Mesh(btnGeo, buttonM)
          const [bx, by] = px(333, y)
          b.position.set(bx, by, front + 0.02)
          geary.add(b)
        }
        for (const y of [560, 578]) {
          const b = new THREE.Mesh(btnGeo, inkM)
          const [bx, by] = px(338, y)
          b.position.set(bx, by, front + 0.04)
          geary.add(b)
        }

        // ───────── bow tie
        {
          const [bx, by] = px(335, 380)
          const wingGeo = new THREE.ConeGeometry(0.075, 0.17, 4)
          for (const side of [-1, 1]) {
            const wing = new THREE.Mesh(wingGeo, bowM)
            wing.rotation.z = (side * Math.PI) / 2
            wing.rotation.x = Math.PI / 4
            wing.scale.set(1, 1, 0.5)
            wing.position.set(bx + side * 0.09, by, front + 0.06)
            geary.add(wing)
          }
          const knot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 20, 12), bowM)
          knot.scale.set(1, 1.1, 0.7)
          knot.position.set(bx, by, front + 0.07)
          geary.add(knot)
        }

        // ───────── name tag
        {
          const c = document.createElement('canvas')
          c.width = 256
          c.height = 64
          const ctx = c.getContext('2d')
          const grad = ctx.createLinearGradient(0, 0, 256, 0)
          grad.addColorStop(0, '#a8651d')
          grad.addColorStop(0.5, '#f3c77a')
          grad.addColorStop(1, '#a8651d')
          ctx.fillStyle = grad
          ctx.fillRect(0, 0, 256, 64)
          ctx.fillStyle = '#1a1006'
          ctx.font = '600 38px Poppins, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('Geary', 128, 35)
          const tex = new THREE.CanvasTexture(c)
          tex.colorSpace = THREE.SRGBColorSpace
          const edge = mat(0xb87a2a, { metalness: 1, roughness: 0.3 })
          const face = mat(0xffffff, { map: tex, metalness: 0.5, roughness: 0.35 })
          const tag = new THREE.Mesh(new THREE.BoxGeometry(84 / S, 21 / S, 0.015), [edge, edge, edge, edge, face, edge])
          const [tx, ty] = px(494, 428)
          tag.position.set(tx, ty, front + 0.045)
          geary.add(tag)
        }

        // ───────── sizing
        const resize = () => {
          renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false)
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(host)

        // ───────── pointer + loop (only while visible)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const target = { x: 0, y: 0 }
        const onMove = (e) => {
          target.x = (e.clientX / window.innerWidth) * 2 - 1
          target.y = (e.clientY / window.innerHeight) * 2 - 1
        }
        if (!reduce) window.addEventListener('pointermove', onMove)

        let visible = true
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
        io.observe(host)
        const aim = { x: 0, y: 0 }
        let raf
        const frame = (now) => {
          raf = requestAnimationFrame(frame)
          if (!visible) return
          aim.x += (target.x - aim.x) * 0.06
          aim.y += (target.y - aim.y) * 0.06
          const sway = reduce ? 0 : Math.sin(now * 0.0012) * 10
          geary.rotation.y = (aim.x * 28 + sway) * RAD * look.tilt
          geary.rotation.x = aim.y * 12 * RAD * look.tilt
          render(scene, camera)
        }
        raf = requestAnimationFrame(frame)

        cleanup = () => {
          cancelAnimationFrame(raf)
          window.removeEventListener('pointermove', onMove)
          ro.disconnect()
          io.disconnect()
          scene.traverse((o) => {
            o.geometry?.dispose()
            if (o.material) [].concat(o.material).forEach((m) => (m.map?.dispose(), m.dispose()))
          })
          envTex.dispose()
          disposeLook()
          pmrem.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
        if (dead) cleanup()
      } catch (e) {
        console.warn('3D Geary unavailable, using the image', e)
        onFail?.()
      }
    })()

    return () => {
      dead = true
      cleanup()
    }
  }, [])

  return (
    <div className="relative w-full" style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }} role="img" aria-label="Geary, the Product Jackpot dealer">
      <div
        ref={hostRef}
        className="pointer-events-none absolute drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]"
        style={{ inset: `-${OVERHANG * 100}%` }}
      />
    </div>
  )
}
