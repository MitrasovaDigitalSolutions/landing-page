"use client";

import { useMutation } from "@tanstack/react-query";
import { Layers, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageFormDialog } from "@/features/home/components/admin/page-form-dialog";
import { PageSectionCard } from "@/features/home/components/admin/page-section-card";
import { PageSectionsHeader } from "@/features/home/components/admin/page-sections-header";
import { SectionFormDialog } from "@/features/home/components/admin/section-form-dialog";
import { deleteSectionAction } from "@/features/home/services/pages.actions";
import type { PageDetail, PageSection } from "@/types/api.types";

interface PageSectionsManagerProps {
  page: PageDetail;
}

export function PageSectionsManager({
  page,
}: PageSectionsManagerProps): React.JSX.Element {
  const router = useRouter();
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<PageSection | null>(null);

  const sortedSections = [...(page.sections ?? [])].sort(
    (a, b) => a.order - b.order
  );
  const lastSection = sortedSections.at(-1);
  const nextOrder = lastSection ? lastSection.order + 1 : 0;

  const deleteMutation = useMutation({
    mutationFn: async (sectionId: number) =>
      deleteSectionAction(sectionId, page.id, page.slug),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const handleOpenCreateSection = (): void => {
    setSelectedSection(null);
    setSectionDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      <PageSectionsHeader
        page={page}
        onEditPage={() => {
          setPageDialogOpen(true);
        }}
        onAddSection={handleOpenCreateSection}
      />

      {sortedSections.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sortedSections.map((section) => (
            <PageSectionCard
              key={section.id}
              section={section}
              onEdit={(target) => {
                setSelectedSection(target);
                setSectionDialogOpen(true);
              }}
              onDelete={(target) => {
                setDeleteTarget(target);
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Layers className="size-5" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Belum ada section pada halaman ini
          </p>
          <p className="max-w-sm text-xs text-slate-500">
            Tambahkan section seperti hero, sejarah, visi-misi, atau cta untuk
            menyusun konten halaman ini.
          </p>
          <Button
            size="sm"
            onClick={handleOpenCreateSection}
            className="mt-2 gap-1.5 rounded-xl text-xs font-semibold"
          >
            <Plus className="size-4" />
            <span>Tambah Section Pertama</span>
          </Button>
        </Card>
      )}

      <PageFormDialog
        page={page}
        open={pageDialogOpen}
        onOpenChange={setPageDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <SectionFormDialog
        pageId={page.id}
        pageSlug={page.slug}
        section={selectedSection}
        defaultOrder={nextOrder}
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteTarget(null);
          }
        }}
        title="Hapus Section?"
        description={`Section dengan key "${deleteTarget?.key ?? ""}" akan dihapus permanen dari halaman ini.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
      />
    </div>
  );
}
