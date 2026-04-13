import { Card } from "@/components/ui/Card";
import { getAdminCategories } from "@/lib/queries/admin";
import { CategoryForm } from "./CategoryForm";
import { CategoryRow } from "./CategoryRow";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  const parentCategories = categories.filter((c) => !c.parent_id);
  const childMap = new Map<string, typeof categories>();
  categories
    .filter((c) => c.parent_id)
    .forEach((c) => {
      const children = childMap.get(c.parent_id!) ?? [];
      children.push(c);
      childMap.set(c.parent_id!, children);
    });

  return (
    <div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-6">
        Category Management
      </h1>

      {/* Add Category */}
      <Card variant="compact" className="mb-6">
        <h2 className="text-[16px] font-semibold mb-4">Add Category</h2>
        <CategoryForm
          parentCategories={parentCategories.map((c) => ({
            id: c.id,
            name: c.name,
          }))}
        />
      </Card>

      {/* Categories List */}
      <Card>
        <h2 className="text-[18px] font-semibold mb-4">
          Categories ({categories.length})
        </h2>

        {categories.length === 0 ? (
          <p className="text-[14px] text-text-muted py-8 text-center">
            No categories yet
          </p>
        ) : (
          <div className="space-y-1">
            {parentCategories.map((parent) => (
              <div key={parent.id}>
                <CategoryRow
                  category={parent}
                  parentCategories={parentCategories
                    .filter((c) => c.id !== parent.id)
                    .map((c) => ({ id: c.id, name: c.name }))}
                />
                {childMap.get(parent.id)?.map((child) => (
                  <div key={child.id} className="ml-8">
                    <CategoryRow
                      category={child}
                      parentCategories={parentCategories.map((c) => ({
                        id: c.id,
                        name: c.name,
                      }))}
                      isChild
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
