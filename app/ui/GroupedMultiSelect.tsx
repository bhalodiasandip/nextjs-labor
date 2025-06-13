import Select from "react-select";

interface GroupedMultiSelectProps {
  options: any[];
  value: any[];
  onChange: (value: any[]) => void;
  placeholder: string;
}

const GroupedMultiSelect: React.FC<GroupedMultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff", // bg-white
      borderColor: state.isFocused ? "#86efac" : "#d1d5db", // green-300 or gray-300
      borderRadius: "0.375rem",
      borderWidth: 1,
      minHeight: "2.5rem",
      fontSize: "0.875rem",
      padding: "0.25rem 0.5rem",
      boxShadow: "none", // remove focus ring glow
      "&:hover": {
        borderColor: "#15803d", // green-300
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // text-gray-500
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      color: "#1f2937", // text-gray-800
      fontSize: "0.875rem",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.375rem",
      marginTop: "0.25rem",
      zIndex: 20,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#22c55e" // green-500
        : state.isFocused
        ? "#dcfce7" // green-100
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
      fontSize: "0.75rem",
      padding: "0.5rem 0.75rem",
      ":active": {
        backgroundColor: state.isSelected
          ? "#22c55e"
          : state.isFocused
          ? "#dcfce7"
          : "white", // 🔒 lock it — prevent light blue flash
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgb(14 159 110 / var(--tw-bg-opacity, 1))", // green-500 → matches cross hover bg
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white", // white text on green
      fontWeight: 500,
      fontSize: "0.75rem",
    }),
    multiValueRemove: (base) => ({
      ...base,
      backgroundColor: "#15803d", // green-700 → was previous pill bg
      borderRadius: "0.25rem",
      color: "white",
      padding: "0 4px",
      ":hover": {
        backgroundColor: "#15803d", // keep same as non-hover
        color: "white",
      },
    }),
    groupHeading: (base) => ({
      ...base,
      fontSize: "0.875rem", // or "1.125rem" for text-lg
      fontWeight: "600",
      color: "#15803d", // Optional: a green shade
      padding: "0.25rem 0.5rem",
    }),
  };

  return (
    <Select
      isMulti
      options={options} // Ensure options is correct here
      value={value} // Ensure value is correct here
      onChange={onChange} // Ensure this is updating correctly
      styles={customStyles}
      placeholder={placeholder}
    />
  );
};

export default GroupedMultiSelect;
