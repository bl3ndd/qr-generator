import { ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { useCallback, useRef } from 'react'

export function CustomColorPicker({
  label,
  color,
  setColor,
}: {
  label: string
  color: string
  setColor: (color: string) => void
}) {
  const lastColor = useRef(color)

  const handleChange = useCallback(
    (c: Color) => {
      const newColor = c.toHexString()
      if (newColor !== lastColor.current) {
        lastColor.current = newColor
        setColor(newColor)
      }
    },
    [setColor]
  )

  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <ColorPicker value={color} size="large" showText onChange={handleChange} />
    </div>
  )
}
