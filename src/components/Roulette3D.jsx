import { useEffect, useRef } from 'react'

/**
 * A real 3D roulette wheel (three.js), driven by motion values owned by the parent:
 *   wheel  – wheel rotation in degrees, clockwise seen from above
 *   ball   – ball angle in degrees, clockwise from 12 o'clock (screen frame)
 *   ballR  – ball orbit radius (1 = outer edge of the bowl)
 *   riding – ref; when set to { phi } the ball is parked in the pocket at wheel angle phi
 *   spinning – ref(bool); adds a little bounce while the ball drops into pockets
 *
 * Pockets alternate red / black: 36 of them, 10° each, pocket s spans [10s-10, 10s)
 * clockwise from 12 o'clock, so pocket 0 is red and ends at 12 o'clock.
 */
const RAD = Math.PI / 180
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
// height of the surface the ball rolls on, by radius
const surf = (r) => (r >= 0.95 ? 0.145 : r >= 0.88 ? 0.07 + ((r - 0.88) / 0.07) * 0.075 : 0.07 * smooth(0.84, 0.88, r))

export default function Roulette3D({ wheel, ball, ballR, riding, spinning, onFail }) {
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

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
                renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
        host.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const pmrem = new THREE.PMREMGenerator(renderer)
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
        scene.environment = envTex
        scene.environmentIntensity = 0.55

        scene.add(new THREE.AmbientLight(0xffe2cf, 0.9))
        const key = new THREE.DirectionalLight(0xfff0dd, 1.5)
        key.position.set(-2, 4, 3)
        scene.add(key)
        const rim = new THREE.PointLight(0xe33148, 6, 6)
        rim.position.set(1.6, 0.8, 1.4)
        scene.add(rim)

        const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 50)
        const elev = 31 * RAD
        const dist = 4.1
        camera.position.set(0, Math.sin(elev) * dist, Math.cos(elev) * dist)
        camera.lookAt(0, 0, 0)

        // ───────── materials
        const gold = new THREE.MeshStandardMaterial({ color: 0xe8a54b, metalness: 1, roughness: 0.28 })
        const goldDark = new THREE.MeshStandardMaterial({ color: 0xa8651d, metalness: 1, roughness: 0.4 })
        const wood = new THREE.MeshStandardMaterial({ color: 0x4d0a14, metalness: 0.2, roughness: 0.35, side: THREE.DoubleSide })
        const blackM = new THREE.MeshStandardMaterial({ color: 0x0b0405, metalness: 0.3, roughness: 0.4, side: THREE.DoubleSide })
        const redM = new THREE.MeshStandardMaterial({ color: 0xc10c0c, metalness: 0, roughness: 0.9, envMapIntensity: 0.12, side: THREE.DoubleSide })
        const darkM = new THREE.MeshStandardMaterial({ color: 0x1d0805, metalness: 0, roughness: 0.9, envMapIntensity: 0.12, side: THREE.DoubleSide })
        const coreM = new THREE.MeshStandardMaterial({ color: 0x1f0703, metalness: 0.4, roughness: 0.35, side: THREE.DoubleSide })

        const root = new THREE.Group()
        scene.add(root)

        // ───────── static bowl (the outer ring the ball runs on)
        const bowlProfile = [
          [0.86, -0.1], [1.0, -0.1], [1.0, 0.08], [0.985, 0.13], [0.95, 0.145], [0.9, 0.12], [0.88, 0.07], [0.86, 0.035],
        ].map(([r, y]) => new THREE.Vector2(r, y))
        const bowl = new THREE.Mesh(new THREE.LatheGeometry(bowlProfile, 96), wood)
        root.add(bowl)
        const outerBlack = new THREE.Mesh(new THREE.CylinderGeometry(1.03, 1.03, 0.22, 96, 1, true), blackM)
        outerBlack.position.y = 0
        root.add(outerBlack)
        const lip = new THREE.Mesh(new THREE.TorusGeometry(0.965, 0.011, 12, 128), gold)
        lip.rotation.x = Math.PI / 2
        lip.position.y = 0.147
        root.add(lip)
        const trackRing = new THREE.Mesh(new THREE.TorusGeometry(0.875, 0.01, 12, 128), gold)
        trackRing.rotation.x = Math.PI / 2
        trackRing.position.y = 0.07
        root.add(trackRing)

        // ───────── spinning wheel
        const wheelG = new THREE.Group()
        root.add(wheelG)

        const P_IN = 0.6
        const P_OUT = 0.86
        const sector = (r0, r1, a0, a1, y, mat) => {
          const p = (r, a) => [r * Math.sin(a * RAD), y, -r * Math.cos(a * RAD)]
          const v = [...p(r0, a0), ...p(r1, a0), ...p(r1, a1), ...p(r0, a0), ...p(r1, a1), ...p(r0, a1)]
          const g = new THREE.BufferGeometry()
          g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
          g.setAttribute('normal', new THREE.Float32BufferAttribute(Array(6).fill([0, 1, 0]).flat(), 3))
          return new THREE.Mesh(g, mat)
        }
        for (let s = 0; s < 36; s++) {
          wheelG.add(sector(P_IN, P_OUT, 10 * s - 10, 10 * s, 0, s % 2 === 0 ? redM : darkM))
        }
        // frets between pockets
        const fretGeo = new THREE.BoxGeometry(0.012, 0.05, P_OUT - P_IN)
        for (let s = 0; s < 36; s++) {
          const a = 10 * s
          const m = new THREE.Mesh(fretGeo, gold)
          const r = (P_IN + P_OUT) / 2
          m.position.set(r * Math.sin(a * RAD), 0.025, -r * Math.cos(a * RAD))
          m.rotation.y = -a * RAD
          wheelG.add(m)
        }
        for (const r of [P_IN, P_OUT - 0.002]) {
          const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.014, 12, 128), r === P_IN ? goldDark : gold)
          t.rotation.x = Math.PI / 2
          t.position.y = 0.02
          wheelG.add(t)
        }

        // turret: sloped cone up to a flat plateau
        const coneProfile = [[P_IN, 0.0], [P_IN - 0.02, 0.03], [0.34, 0.12], [0.3, 0.128], [0, 0.128]].map(([r, y]) => new THREE.Vector2(r, y))
        wheelG.add(new THREE.Mesh(new THREE.LatheGeometry(coneProfile, 96), coreM))
        const plateauRing = new THREE.Mesh(new THREE.TorusGeometry(0.325, 0.01, 10, 96), gold)
        plateauRing.rotation.x = Math.PI / 2
        plateauRing.position.y = 0.125
        wheelG.add(plateauRing)

        const gearShape = (R, r, teeth, w) => {
          const sh = new THREE.Shape()
          const step = 360 / teeth
          for (let k = 0; k < teeth; k++) {
            const a = k * step
            const pts = [[r, a - w * 1.6], [R, a - w], [R, a + w], [r, a + w * 1.6]]
            pts.forEach(([rad, ang], i) => {
              const x = rad * Math.cos(ang * RAD)
              const y = rad * Math.sin(ang * RAD)
              if (k === 0 && i === 0) sh.moveTo(x, y)
              else sh.lineTo(x, y)
            })
          }
          sh.closePath()
          return sh
        }
        const bigGear = new THREE.Mesh(new THREE.ExtrudeGeometry(gearShape(0.27, 0.2, 8, 7), { depth: 0.02, bevelEnabled: false }), gold)
        bigGear.rotation.x = -Math.PI / 2
        bigGear.position.y = 0.128
        wheelG.add(bigGear)
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.03, 48), coreM)
        dish.position.y = 0.15
        wheelG.add(dish)
        const smallGear = new THREE.Mesh(new THREE.ExtrudeGeometry(gearShape(0.085, 0.06, 8, 9), { depth: 0.02, bevelEnabled: false }), goldDark)
        smallGear.rotation.x = -Math.PI / 2
        smallGear.position.y = 0.165
        wheelG.add(smallGear)
        // four-point star spokes
        for (const ry of [0, Math.PI / 2]) {
          const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.012, 0.66), gold)
          spoke.position.y = 0.186
          spoke.rotation.y = ry
          wheelG.add(spoke)
        }
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 24), gold)
        knob.position.y = 0.2
        wheelG.add(knob)

        // ───────── the ball
        const ballMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.036, 32, 24),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12, metalness: 0, emissive: 0x887766, emissiveIntensity: 0.45 })
        )
        root.add(ballMesh)

        // ───────── sizing
        const resize = () => {
          const w = host.clientWidth || 1
          const h = host.clientHeight || 1
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          // wheel fills the width; push it down so Geary has room above
          const fovH = 2 * Math.atan(Math.tan((camera.fov * RAD) / 2) * camera.aspect)
          const fit = (2 * dist * Math.tan(fovH / 2)) / 2.18
          camera.zoom = fit
          camera.setViewOffset(w, h, 0, -h * 0.17, w, h)
          camera.updateProjectionMatrix()
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(host)

        // ───────── loop (only while visible)
        let visible = true
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
        io.observe(host)
        let raf
        const frame = (now) => {
          raf = requestAnimationFrame(frame)
          if (!visible) return
          const W = wheel.get()
          wheelG.rotation.y = -W * RAD

          let r = ballR.get()
          let ang
          if (riding.current) {
            ang = riding.current.phi + W
            r = 0.73
          } else {
            ang = ball.get()
          }
          let y = surf(r) + 0.036
          if (spinning.current && r < 0.9) y += 0.03 * Math.abs(Math.sin(now * 0.021)) * Math.min(1, (r - 0.73) / 0.12)
          ballMesh.position.set(r * Math.sin(ang * RAD), y, -r * Math.cos(ang * RAD))
          renderer.render(scene, camera)
        }
        raf = requestAnimationFrame(frame)

        cleanup = () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          io.disconnect()
          scene.traverse((o) => {
            o.geometry?.dispose()
            if (o.material) [].concat(o.material).forEach((m) => m.dispose())
          })
          envTex.dispose()
          pmrem.dispose()
          renderer.dispose()
          renderer.domElement.remove()
        }
        if (dead) cleanup()
      } catch (e) {
        console.warn('3D roulette unavailable, using flat wheel', e)
        onFail?.()
      }
    })()

    return () => {
      dead = true
      cleanup()
    }
  }, [])

  return <div ref={hostRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden />
}
