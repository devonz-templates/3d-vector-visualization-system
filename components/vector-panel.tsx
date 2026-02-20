"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Vector } from "./vector-visualization"
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VectorPanelProps {
  vectors: Vector[]
  onAddVector: (vector: Omit<Vector, "id">) => void
  onDeleteVector: (id: string) => void
  vectorCount: number
}

const colorOptions = [
  { name: "Red", value: "#ff6b6b" },
  { name: "Orange", value: "#ff922b" },
  { name: "Yellow", value: "#ffd43b" },
  { name: "Green", value: "#51cf66" },
  { name: "Cyan", value: "#22d3ee" },
  { name: "Blue", value: "#4dabf7" },
  { name: "Purple", value: "#a78bfa" },
  { name: "Pink", value: "#f472b6" },
  { name: "White", value: "#ffffff" },
]

export default function VectorPanel({ vectors, onAddVector, onDeleteVector, vectorCount }: VectorPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [z, setZ] = useState(0)
  const [color, setColor] = useState("#4dabf7")
  const [label, setLabel] = useState("")

  const handleAddVector = () => {
    const finalLabel = label.trim() === "" ? `Vector ${vectorCount + 1}` : label.trim()

    onAddVector({ x, y, z, color, label: finalLabel })
    // Reset form
    setX(0)
    setY(0)
    setZ(0)
    setLabel("")
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Open vector panel"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    )
  }

  return (
    <div className="absolute top-4 left-4 w-80 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Vector Controls</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
          aria-label="Close panel"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Coordinate inputs */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="x-coord" className="text-xs text-white/80">
              X
            </Label>
            <Input
              id="x-coord"
              type="number"
              step="0.1"
              value={x}
              onChange={(e) => setX(Number.parseFloat(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="y-coord" className="text-xs text-white/80">
              Y
            </Label>
            <Input
              id="y-coord"
              type="number"
              step="0.1"
              value={y}
              onChange={(e) => setY(Number.parseFloat(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div>
            <Label htmlFor="z-coord" className="text-xs text-white/80">
              Z
            </Label>
            <Input
              id="z-coord"
              type="number"
              step="0.1"
              value={z}
              onChange={(e) => setZ(Number.parseFloat(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Label input */}
        <div>
          <Label htmlFor="label" className="text-xs text-white/80">
            Label
          </Label>
          <Input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={`Vector ${vectorCount + 1}`}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* Color picker */}
        <div>
          <Label className="text-xs text-white/80 mb-2 block">Color</Label>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption.value}
                onClick={() => setColor(colorOption.value)}
                className={`w-10 h-10 rounded-md border-2 transition-all ${
                  color === colorOption.value ? "border-white scale-110" : "border-white/30 hover:border-white/60"
                }`}
                style={{ backgroundColor: colorOption.value }}
                aria-label={`Select ${colorOption.name}`}
              />
            ))}
          </div>
        </div>

        {/* Add button */}
        <Button
          onClick={handleAddVector}
          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vector
        </Button>

        {/* Vector list */}
        {vectors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2 text-white/80">Vectors ({vectors.length})</h3>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {vectors.map((vector) => (
                  <div
                    key={vector.id}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded p-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: vector.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{vector.label}</p>
                        <p className="text-xs text-white/60">
                          ({vector.x.toFixed(1)}, {vector.y.toFixed(1)}, {vector.z.toFixed(1)})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteVector(vector.id)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors flex-shrink-0"
                      aria-label={`Delete ${vector.label}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
