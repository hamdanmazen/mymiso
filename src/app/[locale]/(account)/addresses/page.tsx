import { getUserAddresses } from "@/lib/queries/addresses";
import { AddressesClient } from "./AddressesClient";

export default async function AddressesPage() {
  const addresses = await getUserAddresses();

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        My Addresses
      </h1>
      <AddressesClient initialAddresses={addresses} />
    </div>
  );
}
