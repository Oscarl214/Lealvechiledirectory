"use client"

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { Mesh, MeshStandardMaterial } from "three"

const MODEL_URL = "/kia_k5.glb"
/** Kia Wolf Gray, paint code C7S. Fixed to this car. */
const WOLF_GRAY = "#4e5358"

export function K5Model() {
  const gltf = useGLTF(MODEL_URL)
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    cloned.traverse((obj) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh) return
      const paint = (material: MeshStandardMaterial) => {
        const next = material.clone()
        if (next.name === "body") {
          next.color.set(WOLF_GRAY)
          next.metalness = 0.28
          next.roughness = 0.62
        }
        return next
      }
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((material) => paint(material as MeshStandardMaterial))
        : paint(mesh.material as MeshStandardMaterial)
    })
    return cloned
  }, [gltf.scene])

  return <primitive object={scene} scale={0.01} />
}

useGLTF.preload(MODEL_URL)
