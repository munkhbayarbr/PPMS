"use client";

import useSWR from "swr";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type User = { id: string; name: string; email: string };
type Role = { id: string; nameEn: string; nameMn?: string | null };
type EmployeeRole = { id: string; role: Role };

const f = (url: string) => apiFetch<any>(url);

export default function RolesPage() {
  const { data: users, mutate: mutateUsers } = useSWR<User[]>("/users", f);
  const { data: roles } = useSWR<Role[]>("/roles", f);

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const { data: userRoles, mutate: mutateUserRoles } = useSWR<EmployeeRole[]>(
    selectedUserId ? `/employee-roles/by-user/${selectedUserId}` : null,
    f
  );

  async function assignRole(roleId: string) {
    if (!selectedUserId) return;
    try {
      await apiFetch("/employee-roles/assign", {
        method: "POST",
        body: JSON.stringify({ userId: selectedUserId, roleId }),
      });
      toast.success("Role assigned");
      mutateUserRoles();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  }

  async function unassignRole(roleId: string) {
    if (!selectedUserId) return;
    try {
      await apiFetch(`/employee-roles/${selectedUserId}/${roleId}`, {
        method: "DELETE",
      });
      toast.success("Role unassigned");
      mutateUserRoles();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Select User</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUserId && (
            <div className="space-y-4">
              <h3 className="font-semibold">Assigned Roles</h3>
              <div className="flex flex-wrap gap-2">
                {userRoles?.map((er) => (
                  <Button
                    key={er.id}
                    size="sm"
                    variant="secondary"
                    onClick={() => unassignRole(er.role.id)}
                  >
                    {er.role.nameMn || er.role.nameEn} ✕
                  </Button>
                ))}
                {(!userRoles || userRoles.length === 0) && (
                  <p className="text-muted-foreground text-sm">No roles assigned</p>
                )}
              </div>

              <h3 className="font-semibold">Available Roles</h3>
              <div className="flex flex-wrap gap-2">
                {roles
                  ?.filter((r) => !userRoles?.some((ur) => ur.role.id === r.id))
                  .map((r) => (
                    <Button
                      key={r.id}
                      size="sm"
                      variant="outline"
                      onClick={() => assignRole(r.id)}
                    >
                      {r.nameMn || r.nameEn} +
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
