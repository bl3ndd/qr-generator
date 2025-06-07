import { ColorPicker } from 'antd'
import type { Color } from 'antd/es/color-picker'

export function CustomColorPicker({
  label,
  color,
  setColor,
}: {
  label: string
  color: string
  setColor: (color: string) => void
}) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <ColorPicker
        defaultValue={color}
        size="large"
        showText
        onChange={(c: Color) => setColor(c.toHexString())}
      />
    </div>
  )
}
