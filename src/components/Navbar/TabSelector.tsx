import { useState, useEffect } from "react";

interface TabSelectorProps {
  options: string[];
  activeTab?: string;
  onChange?: (active: string) => void;
}

export default function TabSelector({
  options,
  activeTab,
  onChange,
}: TabSelectorProps) {
  const [active, setActive] = useState(activeTab || options[0]);

  useEffect(() => {
    if (activeTab) {
      setActive(activeTab);
    }
  }, [activeTab]);

  function handleClick(option: string) {
    setActive(option);
    onChange?.(option);
  }

  return (
    <div className="flex space-x-6 text-sm">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleClick(option)}
          className={`pb-1 transition ${
            active === option
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-purple-600"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
