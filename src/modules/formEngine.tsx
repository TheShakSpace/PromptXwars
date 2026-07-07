/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

export interface FormFieldSchema {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "number";
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldSchema[];
  submitLabel?: string;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
}

interface FormEngineProps {
  schema: FormSchema;
  className?: string;
}

export function FormEngine({ schema, className = "" }: FormEngineProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    schema.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue !== undefined ? f.defaultValue : "";
    });
    return defaults;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (id: string, val: any) => {
    setFormData((prev) => ({ ...prev, [id]: val }));
    if (errors[id]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate fields
    const newErrors: Record<string, string> = {};
    schema.fields.forEach((field) => {
      const val = formData[field.id];
      if (field.required && (val === undefined || val === "" || val === null)) {
        newErrors[field.id] = `${field.label} is required.`;
      } else if (field.validation) {
        const errorMsg = field.validation(val);
        if (errorMsg) {
          newErrors[field.id] = errorMsg;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await schema.onSubmit(formData);
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit telemetry form parameters.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-neutral-950/40 border border-white/5 p-6 rounded-2xl backdrop-blur-xl ${className}`}>
      <div className="mb-5">
        <h3 className="font-sans font-bold text-sm tracking-tight text-white/95 uppercase">{schema.title}</h3>
        {schema.description && (
          <p className="text-[11px] text-white/40 font-mono font-light mt-1">{schema.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {schema.fields.map((field) => {
          const hasError = !!errors[field.id];

          return (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] text-white/50 uppercase tracking-wider font-bold">
                {field.label} {field.required && <span className="text-rose-400 font-bold">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full bg-neutral-950/60 border ${hasError ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-white/20"} text-white font-mono text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-white/20`}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, Number(e.target.value))}
                  className={`w-full bg-neutral-950/60 border ${hasError ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-white/20"} text-white font-mono text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all`}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  placeholder={field.placeholder}
                  rows={3}
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full bg-neutral-950/60 border ${hasError ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-white/20"} text-white font-mono text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-white/20`}
                />
              )}

              {field.type === "select" && (
                <select
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={`w-full bg-neutral-950/60 border ${hasError ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-white/20"} text-white font-mono text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all`}
                >
                  <option value="" disabled className="bg-neutral-950 text-white/30">
                    {field.placeholder || "Select parameter..."}
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-neutral-950 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    className="rounded border-white/10 bg-neutral-950 text-blue-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-white/60 font-light">{field.placeholder}</span>
                </label>
              )}

              {hasError && (
                <span className="font-mono text-[9px] text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-rose-500" /> {errors[field.id]}
                </span>
              )}
            </div>
          );
        })}

        {/* Submit Status Rows */}
        {submitSuccess && (
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5 font-mono text-[9px] text-emerald-400 font-bold">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            TELEMETRY HANDSHAKE RECORDED SUCCESSFULLY
          </div>
        )}

        {submitError && (
          <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 flex items-center gap-2.5 font-mono text-[9px] text-rose-400 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            SUBMISSION REJECTED: {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white py-3 px-4 rounded-xl font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> DISPATCHING LOGS...
            </>
          ) : (
            schema.submitLabel || "SUBMIT TELEMETRY"
          )}
        </button>
      </form>
    </div>
  );
}
