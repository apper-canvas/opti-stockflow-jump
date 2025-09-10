import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
  options,
  className,
  ...props
}) {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select
          value={value}
          onChange={onChange}
          className={error ? "border-error-500" : ""}
          {...props}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
            error ? "border-error-500" : ""
          )}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      );
    }

    return (
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "border-error-500" : ""}
        {...props}
      />
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}
    </div>
  );
}