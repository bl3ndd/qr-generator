export function ColorPicker({ label, color, setColor }) {
    return (
        <div className="flex flex-col w-fit">
            <label className="text-gray-700 font-medium mb-2">{label}</label>
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-100 border border-gray-300 shadow-inner transition">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 border-none cursor-pointer bg-transparent"
                    style={{
                        WebkitAppearance: 'none',
                        appearance: 'none',
                    }}
                />
                <span className="ml-2 font-mono text-gray-500">{color}</span>
            </div>
        </div>
    );
}
