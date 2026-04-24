"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import type { Skill } from "@/lib/data/skills"

type SkillCubeProps = {
  /** Six skills get mapped to the six faces (in declaration order). */
  skills: readonly Skill[]
  /** Square size in px. Default 220. */
  size?: number
  /** Orbit auto-rotate speed. Default 1.8. */
  autoRotateSpeed?: number
  /** Optional override for the edge-glow line color. Defaults to --accent. */
  edgeColor?: string
  /** Enable user drag to orbit. Default true. */
  interactive?: boolean
  className?: string
}

/**
 * Purpose:
 *   Parse a hex string (with or without leading '#') to a THREE-compatible
 *   24-bit integer. Returns undefined on bad input so callers can fall back.
 *
 * Args:
 *   hex — "#8b5cf6" or "8b5cf6".
 *
 * Returns:
 *   Numeric color (e.g. 0x8b5cf6) or undefined.
 */
function hexToInt(hex: string): number | undefined {
  const clean = hex.trim().replace("#", "")
  if (clean.length !== 6 || /[^0-9a-fA-F]/.test(clean)) return undefined
  return parseInt(clean, 16)
}

/**
 * Purpose:
 *   A translucent 3D cube whose six faces display skill icons. Drop it
 *   anywhere: hero, about-me, a projects detail page, etc. Self-contained
 *   scene with ambient + directional + point lights and an accent edge glow.
 *
 * Args:
 *   skills           — up to 6 skills; extras are ignored, fewer is fine.
 *   size             — canvas edge length in px.
 *   autoRotateSpeed  — OrbitControls autoRotateSpeed.
 *   edgeColor        — CSS hex; defaults to the active accent color.
 *   interactive      — allow click-drag orbit. Disable for purely decorative use.
 *   className        — extra classes on the mount <div>.
 *
 * Returns:
 *   A <div> hosting a WebGL canvas.
 */
export function SkillCube({
  skills,
  size = 220,
  autoRotateSpeed = 1.8,
  edgeColor,
  interactive = true,
  className = "",
}: SkillCubeProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    // Wipe any previous canvas (Fast Refresh / StrictMode remounts).
    el.innerHTML = ""

    /* ── Scene ─────────────────────────────────────────── */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.set(0, 0.3, 2.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    /* ── Controls ──────────────────────────────────────── */
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = interactive
    controls.autoRotate = true
    controls.autoRotateSpeed = autoRotateSpeed

    /* ── Materials (one per face, max 6) ──────────────── */
    const geo = new THREE.BoxGeometry(1.15, 1.15, 1.15)
    const loader = new THREE.TextureLoader()

    /**
     * MeshPhysicalMaterial.color multiplies with `map`. If we use the
     * skill's tint color, dark-palette logos (GitHub, Next.js, etc.) get
     * crushed to near-black. So we keep the base white and let the texture
     * render its native colors; the tint lives on the edge glow instead.
     */
    const makeFaceMaterial = (iconUrl: string) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0.35,
        transparent: true,
        opacity: 0.98,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      })
      loader.load(iconUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        mat.map = tex
        mat.needsUpdate = true
      })
      return mat
    }

    const faces = skills.slice(0, 6)
    // Pad to 6 so BoxGeometry always has a material per face.
    const last = faces[faces.length - 1]
    while (faces.length < 6 && last) faces.push(last)

    const materials =
      faces.length > 0
        ? faces.map((s) => makeFaceMaterial(s.src))
        : Array.from({ length: 6 }, () =>
            new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              metalness: 0.25,
              roughness: 0.4,
              transparent: true,
              opacity: 0.9,
            }),
          )
    const cube = new THREE.Mesh(geo, materials)
    scene.add(cube)

    /* ── Lights ────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const directional = new THREE.DirectionalLight(0xffffff, 1.4)
    directional.position.set(4, 6, 5)
    scene.add(directional)

    // Accent point light adds a colored rim highlight
    const accentHex =
      edgeColor ??
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim()
    const accentInt = hexToInt(accentHex) ?? 0x8b5cf6
    const rim = new THREE.PointLight(accentInt, 2, 8)
    rim.position.set(-3, 2, 2)
    scene.add(rim)

    /* ── Edge glow ─────────────────────────────────────── */
    const edges = new THREE.EdgesGeometry(geo)
    const edgeMat = new THREE.LineBasicMaterial({
      color: accentInt,
      transparent: true,
      opacity: 0.4,
    })
    const edgeLines = new THREE.LineSegments(edges, edgeMat)
    scene.add(edgeLines)

    /* ── Render loop ───────────────────────────────────── */
    let rafId = 0
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    /* ── Cleanup ───────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId)
      controls.dispose()
      renderer.dispose()
      geo.dispose()
      edges.dispose()
      edgeMat.dispose()
      materials.forEach((m) => {
        m.map?.dispose()
        m.dispose()
      })
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [skills, size, autoRotateSpeed, edgeColor, interactive])

  return (
    <div
      ref={mountRef}
      className={`overflow-hidden rounded-xl ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
