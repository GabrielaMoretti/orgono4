
import {
  RectangleLandscape24Regular,
  Circle24Regular,
  Note24Regular,
  Star24Regular,
  Image24Regular,
  Poll24Regular
} from "@fluentui/react-icons";

interface ToolbarProps {
  onAddElement: (type: string) => void;
}

export function Toolbar({ onAddElement }: ToolbarProps) {
  const buttons = [
    {
      type: "rectangle",
      label: "Retângulo",
      icon: <RectangleLandscape24Regular className="w-6 h-6" />, 
      tooltip: "Adicionar retângulo"
    },
    {
      type: "circle",
      label: "Círculo",
      icon: <Circle24Regular className="w-6 h-6" />, 
      tooltip: "Adicionar círculo"
    },
    {
      type: "note",
      label: "Nota",
      icon: <Note24Regular className="w-6 h-6" />, 
      tooltip: "Adicionar nota"
    },
    {
      type: "sticker",
      label: "Sticker",
      icon: <Star24Regular className="w-6 h-6" />, 
      tooltip: "Adicionar sticker"
    },
    {
      type: "image",
      label: "Imagem",
      icon: <Image24Regular className="w-6 h-6" />, 
      tooltip: "Adicionar imagem"
    },
    {
      type: "poll",
      label: "Enquete",
      icon: <Poll24Regular className="w-6 h-6" />, 
      tooltip: "Adicionar enquete"
    },
  ];

  return (
    <aside
      className="toolbar bg-white/90 border-r border-blue-100 rounded-none shadow-none p-4 flex flex-col gap-4 w-56 min-h-screen h-full backdrop-blur-0"
      aria-label="Barra de ferramentas do whiteboard"
    >
      <h2 className="font-bold text-lg mb-2 text-blue-700 tracking-tight">Elementos</h2>
      <div className="flex flex-col gap-2">
        {buttons.map(btn => (
          <button
            key={btn.type}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-semibold text-base shadow transition group focus:outline-none focus:ring-2 focus:ring-blue-400"
            draggable
            aria-label={btn.tooltip}
            title={btn.tooltip}
            onDragStart={e => e.dataTransfer.setData('element-type', btn.type)}
            onClick={() => onAddElement(btn.type)}
          >
            <span className="text-xl">{btn.icon}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
