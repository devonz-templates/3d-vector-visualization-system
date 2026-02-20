"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useState } from "react"
import VectorScene from "./vector-scene"
import VectorPanel from "./vector-panel"

export interface Vector {
  id: string
  x: number
  y: number
  z: number
  color: string
  label: string
}

export default function VectorVisualization() {
  const [vectors, setVectors] = useState<Vector[]>([])

  const addVector = (vector: Omit<Vector, "id">) => {
    const vectorNumber = vectors.length + 1
    const newVector = {
      ...vector,
      id: `vector-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setVectors([...vectors, newVector])
  }

  const deleteVector = (id: string) => {
    setVectors(vectors.filter((v) => v.id !== id))
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }} style={{ background: "#000000" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <VectorScene vectors={vectors} />
        <OrbitControls enableDamping dampingFactor={0.05} rotateSpeed={0.5} zoomSpeed={0.8} />
      </Canvas>
      <VectorPanel
        vectors={vectors}
        onAddVector={addVector}
        onDeleteVector={deleteVector}
        vectorCount={vectors.length}
      />
    </div>
  )
}
