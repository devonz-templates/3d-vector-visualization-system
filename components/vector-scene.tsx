"use client"

import type { Vector } from "./vector-visualization"
import { Line, Sphere, Cone, Html } from "@react-three/drei"
import * as THREE from "three"
import { useState } from "react"

interface VectorSceneProps {
  vectors: Vector[]
}

export default function VectorScene({ vectors }: VectorSceneProps) {
  const [hoveredVector, setHoveredVector] = useState<string | null>(null)

  // Grid size and spacing
  const gridSize = 30
  const gridStep = 1
  const gridDivisions = gridSize / gridStep

  // Create grid lines for horizontal plane (X-Z)
  const horizontalGridLines: [number, number, number][][] = []
  for (let i = -gridSize / 2; i <= gridSize / 2; i += gridStep) {
    // Lines parallel to X axis
    horizontalGridLines.push([
      [i, 0, -gridSize / 2],
      [i, 0, gridSize / 2],
    ])
    // Lines parallel to Z axis
    horizontalGridLines.push([
      [-gridSize / 2, 0, i],
      [gridSize / 2, 0, i],
    ])
  }

  // Create grid lines for vertical plane (Y-Z)
  const verticalGridLines: [number, number, number][][] = []
  for (let i = -gridSize / 2; i <= gridSize / 2; i += gridStep) {
    // Lines parallel to Y axis
    verticalGridLines.push([
      [0, i, -gridSize / 2],
      [0, i, gridSize / 2],
    ])
    // Lines parallel to Z axis
    verticalGridLines.push([
      [0, -gridSize / 2, i],
      [0, gridSize / 2, i],
    ])
  }

  // Render a 3D arrow for a vector
  const renderVectorArrow = (vector: Vector) => {
    const length = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2)
    if (length === 0) return null

    const direction = new THREE.Vector3(vector.x, vector.y, vector.z).normalize()

    // Fixed cone dimensions regardless of vector length
    const coneHeight = 0.4
    const coneRadius = 0.15

    const shaftEndPoint = new THREE.Vector3(vector.x, vector.y, vector.z).sub(
      direction.clone().multiplyScalar(coneHeight / 2),
    )

    // Calculate proper rotation for cone to point in vector direction
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)
    const euler = new THREE.Euler().setFromQuaternion(quaternion)

    const conePosition = new THREE.Vector3(vector.x, vector.y, vector.z)

    return (
      <group key={vector.id}>
        {/* Arrow shaft */}
        <Line
          points={[
            [0, 0, 0],
            [shaftEndPoint.x, shaftEndPoint.y, shaftEndPoint.z],
          ]}
          color={vector.color}
          lineWidth={2}
        />
        <group onPointerEnter={() => setHoveredVector(vector.id)} onPointerLeave={() => setHoveredVector(null)}>
          {/* Arrow head (cone) - fixed size and properly oriented */}
          <Cone
            args={[coneRadius, coneHeight, 16]}
            position={[conePosition.x, conePosition.y, conePosition.z]}
            rotation={[euler.x, euler.y, euler.z]}
          >
            <meshStandardMaterial color={vector.color} />
          </Cone>
          {hoveredVector === vector.id && vector.label && (
            <Html position={[conePosition.x, conePosition.y, conePosition.z]} center style={{ pointerEvents: "none" }}>
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.8)",
                  color: vector.color,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  border: `1px solid ${vector.color}`,
                }}
              >
                {vector.label}
              </div>
            </Html>
          )}
        </group>
      </group>
    )
  }

  return (
    <>
      {/* Horizontal plane grid (X-Z) */}
      {horizontalGridLines.map((points, i) => (
        <Line key={`h-grid-${i}`} points={points} color="#ffffff" lineWidth={0.5} opacity={0.3} transparent />
      ))}

      {/* Vertical plane grid (Y-Z) */}
      {verticalGridLines.map((points, i) => (
        <Line key={`v-grid-${i}`} points={points} color="#ffffff" lineWidth={0.5} opacity={0.3} transparent />
      ))}

      {/* Horizontal plane outline */}
      <Line
        points={[
          [-gridSize / 2, 0, -gridSize / 2],
          [gridSize / 2, 0, -gridSize / 2],
          [gridSize / 2, 0, gridSize / 2],
          [-gridSize / 2, 0, gridSize / 2],
          [-gridSize / 2, 0, -gridSize / 2],
        ]}
        color="#ffffff"
        lineWidth={2}
      />

      {/* Vertical plane outline */}
      <Line
        points={[
          [0, -gridSize / 2, -gridSize / 2],
          [0, gridSize / 2, -gridSize / 2],
          [0, gridSize / 2, gridSize / 2],
          [0, -gridSize / 2, gridSize / 2],
          [0, -gridSize / 2, -gridSize / 2],
        ]}
        color="#ffffff"
        lineWidth={2}
      />

      {/* Origin point - glowing white sphere */}
      <Sphere args={[0.1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>

      {/* Axis arrows */}
      {/* X axis - Red */}
      <Line
        points={[
          [0, 0, 0],
          [gridSize / 2, 0, 0],
        ]}
        color="#ff6b6b"
        lineWidth={2}
      />
      <Cone args={[0.15, 0.4, 16]} position={[gridSize / 2 + 0.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color="#ff6b6b" />
      </Cone>

      {/* Y axis - Green */}
      <Line
        points={[
          [0, 0, 0],
          [0, gridSize / 2, 0],
        ]}
        color="#51cf66"
        lineWidth={2}
      />
      <Cone args={[0.15, 0.4, 16]} position={[0, gridSize / 2 + 0.2, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#51cf66" />
      </Cone>

      {/* Z axis - Blue */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0, gridSize / 2],
        ]}
        color="#4dabf7"
        lineWidth={2}
      />
      <Cone args={[0.15, 0.4, 16]} position={[0, 0, gridSize / 2 + 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#4dabf7" />
      </Cone>

      {/* Render all vectors */}
      {vectors.map((vector) => renderVectorArrow(vector))}
    </>
  )
}
