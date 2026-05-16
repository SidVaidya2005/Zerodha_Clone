import React from "react";

function FormField({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  wrapperClassName = "mb-3",
}) {
  return (
    <div className={wrapperClassName}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export default FormField;
