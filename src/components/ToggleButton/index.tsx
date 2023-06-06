interface IToggleButtonProps {
  value?: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleButton({ value = false, onChange }: IToggleButtonProps) {
  function handleToggle(value: boolean) {
    onChange(value);
  }

  return (
    <div className="flex gap-1 bg-zinc-400 border-2 border-zinc-400 rounded-md overflow-hidden">
      <button
        type={"button"}
        className={`py-1 px-2 w-20 ${value ? "bg-zinc-400 " : "bg-zinc-100 "}`}
        onClick={() => handleToggle(false)}
      >
        OFF
      </button>

      <button
        type={"button"}
        className={`py-1 px-2 w-20 ${value ? "bg-zinc-100 " : "bg-zinc-400 "}`}
        onClick={() => handleToggle(true)}
      >
        ON
      </button>
    </div>
  );
}
