import { useState, useMemo } from "react";
import { type EquipmentNode } from "@/types";

interface EquipmentTreeProps {
  onSelectionChange: (ids: string[]) => void;
}

const TREE_DATA: EquipmentNode[] = [
  {
    id: "FAC-01",
    name: "창원 제1공장",
    type: "factory",
    children: [
      {
        id: "AREA-A",
        name: "A-Line (믹싱)",
        type: "area",
        children: [
          { id: "EQP-1001", name: "믹서기 #1", type: "equipment" },
          { id: "EQP-1002", name: "믹서기 #2", type: "equipment" },
        ],
      },
      {
        id: "AREA-B",
        name: "B-Line (포장)",
        type: "area",
        children: [{ id: "EQP-1003", name: "충진기 #1", type: "equipment" }],
      },
    ],
  },
  {
    id: "FAC-02",
    name: "울산 제2공장",
    type: "factory",
    children: [
      {
        id: "AREA-C",
        name: "C-Line (검사)",
        type: "area",
        children: [
          { id: "EQP-1004", name: "비전검사기 #1", type: "equipment" },
          { id: "EQP-1005", name: "중량검사기 #1", type: "equipment" },
        ],
      },
    ],
  },
];

function getAllEquipmentIds(nodes: EquipmentNode[]): string[] {
  const ids: string[] = [];
  nodes.forEach((node) => {
    if (node.type === "equipment") ids.push(node.id);
    if (node.children) ids.push(...getAllEquipmentIds(node.children));
  });
  return ids;
}

function collectExpandableIds(nodes: EquipmentNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.children?.length) {
      ids.push(node.id);
      ids.push(...collectExpandableIds(node.children));
    }
  }
  return ids;
}

export default function EquipmentTree({
  onSelectionChange,
}: EquipmentTreeProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>(() =>
    collectExpandableIds(TREE_DATA),
  );
  const [searchTerm, setSearchTerm] = useState("");

  const allEquipmentIds = useMemo(() => getAllEquipmentIds(TREE_DATA), []);

  const handleSelectAll = (checked: boolean) => {
    const next = checked ? allEquipmentIds : [];
    setSelected(next);
    onSelectionChange(next);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleEqp = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    setSelected(next);
    onSelectionChange(next);
  };

  const renderTree = (nodes: EquipmentNode[]) => {
    return nodes.map((node) => {
      const isEquipment = node.type === "equipment";
      const isSelected = selected.includes(node.id);

      if (
        searchTerm &&
        isEquipment &&
        !node.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return null;
      }

      return (
        <div
          key={node.id}
          className="ml-4 border-l border-slate-200 pl-2 py-0.5"
        >
          <div
            className={[
              "flex items-center gap-2 hover:bg-slate-100 p-1 rounded transition-colors group",
              isEquipment ? "cursor-pointer" : "",
            ].join(" ")}
            onClick={() => isEquipment && toggleEqp(node.id)}
          >
            {node.children ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="w-4 text-slate-400 text-xs"
              >
                {expanded.includes(node.id) ? "▼" : "▶"}
              </button>
            ) : (
              <span className="w-4" />
            )}

            {isEquipment ? (
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="w-4 h-4 accent-emerald-500 pointer-events-none"
              />
            ) : (
              <span className="text-[9px] font-bold text-slate-500 uppercase px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded">
                {node.type === "factory" ? "FAC" : "LINE"}
              </span>
            )}
            <span
              className={`text-sm ${isEquipment ? (isSelected ? "text-emerald-600 font-semibold" : "text-slate-600") : "font-bold text-slate-800"}`}
            >
              {node.name}
            </span>
          </div>
          {node.children && expanded.includes(node.id) && (
            <div className="mt-0.5">{renderTree(node.children)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex flex-col gap-2 p-1">
        <div className="relative">
          <input
            type="text"
            placeholder="설비명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={
                selected.length === allEquipmentIds.length &&
                allEquipmentIds.length > 0
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-3.5 h-3.5 accent-emerald-600"
            />
            <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
              전체 설비 선택
            </span>
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            {selected.length} / {allEquipmentIds.length}
          </span>
        </div>
      </div>

      <hr className="border-slate-200" />

      <div className="flex-1 overflow-auto select-none py-1 custom-scrollbar">
        {renderTree(TREE_DATA)}
      </div>
    </div>
  );
}
