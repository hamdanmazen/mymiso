"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { addAddress, updateAddress } from "@/lib/actions/address";
import { addressSchema, type AddressInput } from "@/lib/utils/validators";
import type { Database } from "@/types/database";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

const LABEL_OPTIONS = [
  { value: "Home", label: "Home" },
  { value: "Work", label: "Work" },
  { value: "Other", label: "Other" },
];

const COUNTRY_OPTIONS = [
  { value: "LB", label: "Lebanon" },
  { value: "JO", label: "Jordan" },
  { value: "AE", label: "UAE" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "EG", label: "Egypt" },
  { value: "IQ", label: "Iraq" },
  { value: "SY", label: "Syria" },
  { value: "KW", label: "Kuwait" },
  { value: "QA", label: "Qatar" },
  { value: "BH", label: "Bahrain" },
  { value: "OM", label: "Oman" },
];

interface AddressFormProps {
  address?: AddressRow;
  onSuccess: (addressId: string) => void;
  onCancel?: () => void;
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const formData = new FormData(e.currentTarget);
    const input: AddressInput = {
      label: formData.get("label") as string,
      fullName: formData.get("fullName") as string,
      phone: (formData.get("phone") as string) || undefined,
      streetAddress: formData.get("streetAddress") as string,
      apartment: (formData.get("apartment") as string) || undefined,
      city: formData.get("city") as string,
      state: (formData.get("state") as string) || undefined,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      isDefault: formData.get("isDefault") === "on",
    };

    const parsed = addressSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString();
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const result = address
      ? await updateAddress(address.id, parsed.data)
      : await addAddress(parsed.data);

    setIsLoading(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    const resultId =
      "addressId" in result
        ? (result as { addressId: string }).addressId
        : address?.id ?? "";
    onSuccess(resultId);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="bg-error-subtle text-error rounded-comfortable px-4 py-3 text-[14px]">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Select
          name="label"
          label="Label"
          options={LABEL_OPTIONS}
          defaultValue={address?.label ?? "Home"}
          error={errors.label}
        />
        <Input
          name="fullName"
          label="Full Name"
          defaultValue={address?.full_name ?? ""}
          error={errors.fullName}
        />
      </div>

      <Input
        name="phone"
        label="Phone Number"
        type="tel"
        defaultValue={address?.phone ?? ""}
        error={errors.phone}
      />

      <Input
        name="streetAddress"
        label="Street Address"
        defaultValue={address?.street_address ?? ""}
        error={errors.streetAddress}
      />

      <Input
        name="apartment"
        label="Apartment, Suite, etc. (optional)"
        defaultValue={address?.apartment ?? ""}
        error={errors.apartment}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="city"
          label="City"
          defaultValue={address?.city ?? ""}
          error={errors.city}
        />
        <Input
          name="state"
          label="State / Province (optional)"
          defaultValue={address?.state ?? ""}
          error={errors.state}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          name="postalCode"
          label="Postal Code"
          defaultValue={address?.postal_code ?? ""}
          error={errors.postalCode}
        />
        <Select
          name="country"
          label="Country"
          options={COUNTRY_OPTIONS}
          defaultValue={address?.country ?? "LB"}
          error={errors.country}
        />
      </div>

      <label className="flex items-center gap-2 text-[14px] text-text-secondary cursor-pointer">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.is_default ?? false}
          className="w-4 h-4 rounded accent-mizo-red"
        />
        Set as default address
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {address ? "Update Address" : "Save Address"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
