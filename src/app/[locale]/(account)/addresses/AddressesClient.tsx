"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddressList } from "@/components/checkout/AddressList";
import { AddressForm } from "@/components/checkout/AddressForm";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import type { Database } from "@/types/database";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

interface AddressesClientProps {
  initialAddresses: AddressRow[];
}

export function AddressesClient({ initialAddresses }: AddressesClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  function handleChange() {
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add Address
        </Button>
      </div>

      <AddressList
        addresses={initialAddresses}
        allowManage
        onAddressChange={handleChange}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Address"
      >
        <AddressForm
          onSuccess={() => {
            setShowAddModal(false);
            handleChange();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </>
  );
}
