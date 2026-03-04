import { useState, useEffect } from "react";

interface EditableCellProps<T> {
  value: T;
  onUpdate: (value: T) => void;
  type?: "text" | "number" | "select";
  options?: string[];
  className?: string;
}

export function EditableCell<T extends string | number>({
  value: initialValue,
  onUpdate,
  type = "text",
  options,
  className,
}: EditableCellProps<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    setIsEditing(false);
    onUpdate(value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onBlur();
    if (e.key === "Escape") {
      setIsEditing(false);
      setValue(initialValue);
    }
  };

  if (isEditing) {
    if (type === "select" && options) {
      return (
        <select
          value={value as string}
          onChange={(e) => setValue(e.target.value as unknown as T)}
          onBlur={onBlur}
          autoFocus
          className="w-full border-2 border-emerald-500 rounded px-1 outline-none shadow-sm"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        value={value as string | number}
        onChange={(e) => {
          const val =
            type === "number" ? Number(e.target.value) : e.target.value;
          setValue(val as unknown as T);
        }}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus
        className="w-full border-2 border-emerald-500 rounded px-1 outline-none font-medium shadow-inner bg-white"
      />
    );
  }

  if (!isEditing) {
    return (
      <span
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer ${className}`}
      >
        {value}
      </span>
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className="w-full h-full min-h-[24px] flex items-center cursor-pointer hover:bg-slate-50 transition-colors px-1 rounded"
      title="더블 클릭하여 수정"
    >
      {type === "number" ? Number(value).toLocaleString() : value}
    </div>
  );
}
