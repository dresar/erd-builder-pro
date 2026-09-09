import React, { useState, useMemo } from 'react';
import { 
  Trash2, 
  Folder, 
  Database, 
  StickyNote, 
  PenTool, 
  Network,
  RefreshCcw, 
  Search,
  X,
  FileText,
  Loader2,
  DatabaseZap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrashTable } from './TrashTable';

interface TrashViewProps {
  trashData: {
    projects: any[];
    diagrams: any[];
    dbClients: any[];
    notes: any[];
    drawings: any[];
    flowcharts: any[];
  };
  restoreProject: (item: any) => Promise<void>;
  restoreDiagram: (item: any) => Promise<void>;
  restoreNote: (item: any) => Promise<void>;
  restoreDrawing: (item: any) => Promise<void>;
  restoreFlowchart: (item: any) => Promise<void>;
  restoreDbClient: (client: any) => Promise<void>;
  fetchTrash: () => void;
  handleProjectPermanentDelete: (file: any) => void;
  handleDiagramPermanentDelete: (file: any) => void;
  handleNotePermanentDelete: (file: any) => void;
  handleDrawingPermanentDelete: (file: any) => void;
  handleFlowchartPermanentDelete: (file: any) => void;
  handleDbClientPermanentDelete: (file: any) => void;
  isLoading?: boolean;
}

export function TrashView({
  trashData,
  restoreProject,
  restoreDiagram,
  restoreNote,
  restoreDrawing,
  restoreFlowchart,
  restoreDbClient,
  fetchTrash,
  handleProjectPermanentDelete,
  handleDiagramPermanentDelete,
  handleNotePermanentDelete,
  handleDrawingPermanentDelete,
  handleFlowchartPermanentDelete,
  handleDbClientPermanentDelete,
  isLoading = false
}: TrashViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Split notes into PRD documents and regular notes
  const { prdNotes, regularNotes } = useMemo(() => {
    const allNotes = trashData.notes || [];
    const prd: any[] = [];
    const regular: any[] = [];
    for (const note of allNotes) {
      if (typeof note.title === 'string' && note.title.startsWith('[PRD] ')) {
        prd.push(note);
      } else {
        regular.push(note);
      }
    }
    return { prdNotes: prd, regularNotes: regular };
  }, [trashData.notes]);

  const totalCount = 
    (trashData.projects?.length || 0) +
    (trashData.diagrams?.length || 0) +
    prdNotes.length +
    regularNotes.length +
    (trashData.drawings?.length || 0) +
    (trashData.flowcharts?.length || 0) +
    (trashData.dbClients?.length || 0);

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchTrash();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 border rounded-xl bg-background overflow-hidden relative">
      {/* Subtle Loading Overlay on Initial Load */}
      {isLoading && totalCount === 0 && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin opacity-70" />
          <p className="mt-2 text-xs font-medium text-muted-foreground">Memuat sampah...</p>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-6 border-b shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-muted/60 text-muted-foreground">
              <Trash2 size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Sampah</h2>
            <Badge variant="secondary" className="text-xs font-medium px-2 py-0.5">
              {totalCount} Item
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Kelola file dan ruang kerja terhapus. Item dapat dipulihkan kapan saja atau dihapus permanen.
          </p>
        </div>

        {/* Action Controls: Search & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-3.5 h-3.5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari..."
              className="h-8 pl-8 pr-8 text-xs bg-background/80"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing || isLoading}
            className="h-8 px-2.5 text-xs font-medium gap-1.5 shrink-0"
          >
            <RefreshCcw size={13} className={isRefreshing ? "animate-spin text-primary" : "opacity-70"} />
            Segarkan
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="projects" className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 overflow-x-auto border-b px-6 py-2.5 custom-scrollbar bg-card/30">
          <TabsList className="w-max h-9 p-1 bg-muted/40">
            <TabsTrigger value="projects" className="text-xs px-3 py-1 gap-1.5">
              <Folder size={13} className="text-amber-500" />
              Ruang Kerja ({trashData.projects?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="diagrams" className="text-xs px-3 py-1 gap-1.5">
              <Database size={13} className="text-blue-500" />
              ERD ({trashData.diagrams?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="prd" className="text-xs px-3 py-1 gap-1.5">
              <FileText size={13} className="text-emerald-500" />
              PRD ({prdNotes.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs px-3 py-1 gap-1.5">
              <StickyNote size={13} className="text-yellow-500" />
              Catatan ({regularNotes.length})
            </TabsTrigger>
            <TabsTrigger value="flowcharts" className="text-xs px-3 py-1 gap-1.5">
              <Network size={13} className="text-cyan-500" />
              Flowchart ({trashData.flowcharts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="drawings" className="text-xs px-3 py-1 gap-1.5">
              <PenTool size={13} className="text-purple-500" />
              Gambar ({trashData.drawings?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="db-clients" className="text-xs px-3 py-1 gap-1.5">
              <Database size={13} className="text-rose-500" />
              Koneksi DB ({trashData.dbClients?.length || 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            {/* Projects Table */}
            <TabsContent value="projects" className="mt-0">
              <TrashTable
                items={trashData.projects || []}
                icon={Folder}
                iconColorClass="text-amber-500"
                isProjectTable={true}
                searchQuery={searchQuery}
                onRestore={restoreProject}
                onDeletePermanent={handleProjectPermanentDelete}
                emptyTitle="Tidak ada ruang kerja terhapus"
                emptyDescription="Semua ruang kerja aktif atau belum ada yang dipindahkan ke sampah."
              />
            </TabsContent>

            {/* Diagrams / ERD Table */}
            <TabsContent value="diagrams" className="mt-0">
              <TrashTable
                items={trashData.diagrams || []}
                icon={Database}
                iconColorClass="text-blue-500"
                searchQuery={searchQuery}
                onRestore={restoreDiagram}
                onDeletePermanent={handleDiagramPermanentDelete}
                emptyTitle="Tidak ada ERD terhapus"
                emptyDescription="Tidak ditemukan diagram ERD di tempat sampah."
              />
            </TabsContent>

            {/* PRD Documents Table */}
            <TabsContent value="prd" className="mt-0">
              <TrashTable
                items={prdNotes}
                icon={FileText}
                iconColorClass="text-emerald-500"
                isPrdTable={true}
                searchQuery={searchQuery}
                onRestore={restoreNote}
                onDeletePermanent={handleNotePermanentDelete}
                emptyTitle="Tidak ada PRD terhapus"
                emptyDescription="Dokumen PRD Anda aman dan tidak ada yang berada di sampah."
              />
            </TabsContent>

            {/* Notes Table */}
            <TabsContent value="notes" className="mt-0">
              <TrashTable
                items={regularNotes}
                icon={StickyNote}
                iconColorClass="text-yellow-500"
                searchQuery={searchQuery}
                onRestore={restoreNote}
                onDeletePermanent={handleNotePermanentDelete}
                emptyTitle="Tidak ada catatan terhapus"
                emptyDescription="Tidak ada catatan umum yang dipindahkan ke sampah."
              />
            </TabsContent>

            {/* Flowcharts Table */}
            <TabsContent value="flowcharts" className="mt-0">
              <TrashTable
                items={trashData.flowcharts || []}
                icon={Network}
                iconColorClass="text-cyan-500"
                searchQuery={searchQuery}
                onRestore={restoreFlowchart}
                onDeletePermanent={handleFlowchartPermanentDelete}
                emptyTitle="Tidak ada flowchart terhapus"
                emptyDescription="Semua diagram flowchart aktif atau belum ada yang dihapus."
              />
            </TabsContent>

            {/* Drawings Table */}
            <TabsContent value="drawings" className="mt-0">
              <TrashTable
                items={trashData.drawings || []}
                icon={PenTool}
                iconColorClass="text-purple-500"
                searchQuery={searchQuery}
                onRestore={restoreDrawing}
                onDeletePermanent={handleDrawingPermanentDelete}
                emptyTitle="Tidak ada gambar terhapus"
                emptyDescription="Papan gambar Excalidraw Anda bersih dari item sampah."
              />
            </TabsContent>

            {/* DB Clients Table */}
            <TabsContent value="db-clients" className="mt-0">
              <TrashTable
                items={trashData.dbClients || []}
                icon={DatabaseZap}
                iconColorClass="text-rose-500"
                searchQuery={searchQuery}
                onRestore={restoreDbClient}
                onDeletePermanent={handleDbClientPermanentDelete}
                emptyTitle="Tidak ada koneksi DB terhapus"
                emptyDescription="Semua koneksi basis data aktif atau belum ada yang dihapus."
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
