import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAdminUsers } from "@/lib/queries/admin";
import { AdminUserActions } from "./AdminUserActions";

const roleColors: Record<string, "success" | "warning" | "error" | "info"> = {
  buyer: "info",
  seller: "success",
  both: "warning",
  admin: "error",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { data: users, total } = await getAdminUsers(
    page,
    20,
    params.search,
    params.role
  );
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        User Management
      </h1>

      {/* Filters */}
      <Card variant="compact" className="mb-6">
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            name="search"
            placeholder="Search by name or phone..."
            defaultValue={params.search ?? ""}
            className="flex-1 min-w-[200px] px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard focus:outline-none focus:border-border-focus"
          />
          <select
            name="role"
            defaultValue={params.role ?? "all"}
            className="px-3 py-2 text-[14px] bg-surface-input border border-border-default rounded-standard"
          >
            <option value="all">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="both">Both</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 text-[14px] font-medium bg-mizo-red text-white rounded-standard hover:bg-mizo-red-hover transition-colors"
          >
            Filter
          </button>
        </form>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold">Users ({total})</h2>
        </div>

        {users.length === 0 ? (
          <p className="text-[14px] text-text-muted py-8 text-center">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary">
                  <th className="text-left py-2 px-3 font-medium">Name</th>
                  <th className="text-left py-2 px-3 font-medium">Phone</th>
                  <th className="text-left py-2 px-3 font-medium">Role</th>
                  <th className="text-left py-2 px-3 font-medium">Language</th>
                  <th className="text-right py-2 px-3 font-medium">Joined</th>
                  <th className="text-right py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-circle bg-mizo-red-subtle text-mizo-red flex items-center justify-center text-[13px] font-semibold shrink-0">
                          {(user.full_name ?? "?")[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium">{user.full_name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-text-secondary">{user.phone ?? "—"}</td>
                    <td className="py-3 px-3">
                      <Badge variant={roleColors[user.role] ?? "info"}>{user.role}</Badge>
                    </td>
                    <td className="py-3 px-3 text-text-secondary uppercase">{user.preferred_language}</td>
                    <td className="py-3 px-3 text-right text-text-muted">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <AdminUserActions userId={user.id} currentRole={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border-subtle">
            {Array.from({ length: totalPages }, (_, i) => (
              <a
                key={i + 1}
                href={`?page=${i + 1}&search=${params.search ?? ""}&role=${params.role ?? "all"}`}
                className={`
                  px-3 py-1.5 text-[13px] font-medium rounded-standard transition-colors
                  ${page === i + 1
                    ? "bg-mizo-red text-white"
                    : "text-text-secondary hover:bg-surface-subtle"
                  }
                `}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
