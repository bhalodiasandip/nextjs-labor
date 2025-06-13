import Select from "react-select";

interface GroupedSingleSelectProps {
  options: { label: string; options: { value: number; label: string }[] }[];
  value: { value: number; label: string } | null;
  onChange: (value: { value: number; label: string } | null) => void;
  placeholder?: string;
  isClearable?: boolean;
}

const GroupedSingleSelect: React.FC<GroupedSingleSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isClearable = true,
}) => {
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "#15803d" : "#d1d5db",
      borderRadius: "0.375rem",
      borderWidth: 1,
      minHeight: "2.5rem",
      fontSize: "0.875rem",
      padding: "0.25rem 0.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#15803d",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#6b7280",
      fontSize: "0.875rem",
    }),
    input: (base: any) => ({
      ...base,
      color: "#1f2937",
      fontSize: "0.875rem",
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0.375rem",
      marginTop: "0.25rem",
      zIndex: 20,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#15803d"
        : state.isFocused
        ? "#dcfce7"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
      fontSize: "0.75rem",
      padding: "0.5rem 0.75rem",
      ":active": {
        backgroundColor: state.isSelected
          ? "#15803d"
          : state.isFocused
          ? "#dcfce7"
          : "white",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#1f2937",
      fontSize: "0.875rem",
    }),
    groupHeading: (base: any) => ({
      ...base,
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#15803d",
      padding: "0.25rem 0.5rem",
    }),
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      isClearable={isClearable}
      styles={customStyles}
      placeholder={placeholder}
    />
  );
};

export default GroupedSingleSelect;
