"use client";

import React from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextInput({
  label,
  error,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
    </FormField>
  );
}

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export function Select({
  label,
  error,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <select
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      >
        <option value="">Select {label?.toLowerCase() || "an option"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function NumberInput({
  label,
  error,
  className = "",
  ...props
}: NumberInputProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <input
        type="number"
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
    </FormField>
  );
}

interface DateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function DateInput({
  label,
  error,
  className = "",
  ...props
}: DateInputProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <input
        type="date"
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
    </FormField>
  );
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({
  label,
  error,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <FormField label={label} error={error} required={props.required}>
      <textarea
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        rows={4}
        {...props}
      />
    </FormField>
  );
}
