"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api/client";
import type { ModerationAuditLog, PaginationMeta } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<ModerationAuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    api.admin
      .auditLogs({ page, limit: 10 })
      .then((result) => {
        setLogs(result.data);
        setMeta(result.meta);
        setLoadError("");
      })
      .catch(() => setLoadError("Failed to load moderation audit logs."))
      .finally(() => setIsLoading(false));
  }, [page]);

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">Review admin moderation actions and status changes.</p>
        {loadError ? <p className="text-sm text-destructive mt-2">{loadError}</p> : null}
      </div>

      <div className="border rounded-xl bg-surface overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Idea</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Loading audit logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No moderation actions have been recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline">{log.action.replaceAll("_", " ")}</Badge>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {log.fromStatus ?? "none"} to {log.toStatus ?? "none"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.idea.title}</TableCell>
                  <TableCell>
                    <div>{log.admin.name}</div>
                    <div className="text-xs text-muted-foreground">{log.admin.email}</div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {log.note || "No note"}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta.totalPages > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.max(1, current - 1));
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem className="px-3 text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((current) => Math.min(meta.totalPages, current + 1));
                }}
                className={page >= meta.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
