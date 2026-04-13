"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AddressForm } from "./AddressForm";
import { deleteAddress, setDefaultAddress } from "@/lib/actions/address";
import { MapPin, Pencil, Trash2, Star } from "lucide-react";
import type { Database } from "@/types/database";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

interface AddressListProps {
  addresses: AddressRow[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  allowManage?: boolean;
  onAddressChange?: () => void;
}

export function AddressList({
  addresses,
  selectedId,
  onSelect,
  allowManage = false,
  onAddressChange,
}: AddressListProps) {
  const [editingAddress, setEditingAddress] = useState<AddressRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteAddress(id);
    setDeletingId(null);
    onAddressChange?.();
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(id);
    onAddressChange?.();
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin size={32} className="text-text-muted mx-auto mb-3" />
        <p className="text-[14px] text-text-secondary">No addresses saved</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {addresses.map((addr) => {
          const isSelected = selectedId === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => onSelect?.(addr.id)}
              className={`
                bg-surface-raised border rounded-spacious p-4 transition-all
                ${onSelect ? "cursor-pointer" : ""}
                ${
                  isSelected
                    ? "border-mizo-teal shadow-[0_0_0_1px_rgba(95,158,160,0.3)]"
                    : "border-border-default hover:border-border-subtle"
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-text-primary">
                      {addr.full_name}
                    </span>
                    <Badge variant="category">{addr.label}</Badge>
                    {addr.is_default && (
                      <Badge variant="verified">Default</Badge>
                    )}
                  </div>
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    {addr.street_address}
                    {addr.apartment && `, ${addr.apartment}`}
                    <br />
                    {addr.city}
                    {addr.state && `, ${addr.state}`} {addr.postal_code}
                    <br />
                    {addr.country}
                  </p>
                  {addr.phone && (
                    <p className="text-[12px] text-text-muted mt-1">
                      {addr.phone}
                    </p>
                  )}
                </div>

                {allowManage && (
                  <div className="flex items-center gap-1 ml-3 shrink-0">
                    {!addr.is_default && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(addr.id);
                        }}
                        className="p-2 text-text-muted hover:text-mizo-teal transition-colors"
                        title="Set as default"
                      >
                        <Star size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(addr);
                      }}
                      className="p-2 text-text-muted hover:text-text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.id);
                      }}
                      disabled={deletingId === addr.id}
                      className="p-2 text-text-muted hover:text-error transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingAddress}
        onClose={() => setEditingAddress(null)}
        title="Edit Address"
      >
        {editingAddress && (
          <AddressForm
            address={editingAddress}
            onSuccess={() => {
              setEditingAddress(null);
              onAddressChange?.();
            }}
            onCancel={() => setEditingAddress(null)}
          />
        )}
      </Modal>
    </>
  );
}
