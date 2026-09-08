import React from 'react';
import { 
  Trash, 
  Folder, 
  Database, 
  StickyNote, 
  PenTool, 
  Network,
  RefreshCcw, 
  Trash2 as TrashIcon,
  Loader2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DbClientTrashSection } from './DbClientTrashSection';

interface TrashViewProps {
  trashData: {
    projects: any[];
    diagrams: any[];
    dbClients: any[];
    notes: any[];
    drawings: any[];
    flowcharts: any[];
  };
  restoreProject: (id: number) => Promise<void>;
  restoreDiagram: (id: number) => Promise<void>;
  restoreNote: (id: number) => Promise<void>;
  restoreDrawing: (id: number) => Promise<void>;
  restoreFlowchart: (id: number) => Promise<void>;
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
  return (
    <div className="flex-1 flex flex-col min-h-0 border rounded-xl bg-background overflow-hidden relative">
      {/* Subtle Loading Overlay */}
      {isLoading && trashData.projects.length === 0 && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin opacity-60" />
          <p className="mt-2 text-xs font-medium text-muted-foreground">Memuat sampah...</p>
        </div>
      )}

      <div className="p-6 border-b shrink-0">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trash size={24} className="text-muted-foreground" />
          Sampah
        </h2>
        <p className="text-sm text-muted-foreground">Kelola file dan ruang kerja yang telah dihapus. Item dapat dipulihkan atau dihapus permanen.</p>
      </div>
      <Tabs defaultValue="projects" className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 overflow-x-auto border-b px-6 py-3 custom-scrollbar">
          <TabsList className="w-max">
            <TabsTrigger value="projects">Ruang Kerja ({trashData.projects.length})</TabsTrigger>
            <TabsTrigger value="diagrams">ERD ({trashData.diagrams.length})</TabsTrigger>
            <TabsTrigger value="db-clients">Koneksi DB ({trashData.dbClients?.length || 0})</TabsTrigger>
            <TabsTrigger value="notes">Catatan ({trashData.notes.length})</TabsTrigger>
            <TabsTrigger value="drawings">Gambar ({trashData.drawings.length})</TabsTrigger>
            <TabsTrigger value="flowcharts">Flowchart ({trashData.flowcharts?.length || 0})</TabsTrigger>
          </TabsList>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            {/* Projects Table */}
            <TabsContent value="projects" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Folder size={18} className="text-orange-400" />
                Ruang Kerja
              </h3>
              <Badge variant="outline">{trashData.projects.length} Item</Badge>
            </div>
            {trashData.projects.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">Belum ada ruang kerja yang dihapus</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Ruang Kerja</TableHead>
                      <TableHead>Dihapus Pada</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trashData.projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Folder size={14} className="text-muted-foreground" />
                          {project.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(project.deleted_at || project.updated_at || project.created_at).toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={async () => { await restoreProject(project.id); fetchTrash(); }}>
                              <RefreshCcw size={14} className="mr-1" /> Pulihkan
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleProjectPermanentDelete(project)}>
                              <TrashIcon size={14} className="mr-1" /> Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            </TabsContent>

            {/* Diagrams Table */}
            <TabsContent value="diagrams" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database size={18} className="text-blue-400" />
                ERD
              </h3>
              <Badge variant="outline">{trashData.diagrams.length} Item</Badge>
            </div>
            {trashData.diagrams.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">Tidak ada ERD terhapus</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Ruang Kerja</TableHead>
                      <TableHead>Dihapus Pada</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trashData.diagrams.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Database size={14} className="text-muted-foreground" />
                          {file.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-semibold">
                          {file.projects?.name || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(file.deleted_at || file.updated_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={async () => { await restoreDiagram(file); }}>
                              <RefreshCcw size={14} className="mr-1" /> Pulihkan
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDiagramPermanentDelete(file)}>
                              <TrashIcon size={14} className="mr-1" /> Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            </TabsContent>

            <TabsContent value="db-clients" className="mt-0">
              <DbClientTrashSection
                clients={trashData.dbClients || []}
                restore={restoreDbClient}
                permanentlyDelete={handleDbClientPermanentDelete}
              />
            </TabsContent>

            {/* Notes Table */}
            <TabsContent value="notes" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <StickyNote size={18} className="text-yellow-400" />
                Catatan
              </h3>
              <Badge variant="outline">{trashData.notes.length} Item</Badge>
            </div>
            {trashData.notes.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">Tidak ada catatan terhapus</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Ruang Kerja</TableHead>
                      <TableHead>Dihapus Pada</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trashData.notes.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <StickyNote size={14} className="text-muted-foreground" />
                          {note.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-semibold">
                          {note.projects?.name || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(note.deleted_at || note.updated_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={async () => { await restoreNote(note); }}>
                              <RefreshCcw size={14} className="mr-1" /> Pulihkan
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleNotePermanentDelete(note)}>
                              <TrashIcon size={14} className="mr-1" /> Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            </TabsContent>

            {/* Drawings Table */}
            <TabsContent value="drawings" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PenTool size={18} className="text-purple-400" />
                Gambar
              </h3>
              <Badge variant="outline">{trashData.drawings.length} Item</Badge>
            </div>
            {trashData.drawings.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">Tidak ada gambar terhapus</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Ruang Kerja</TableHead>
                      <TableHead>Dihapus Pada</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trashData.drawings.map((drawing) => (
                      <TableRow key={drawing.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <PenTool size={14} className="text-muted-foreground" />
                          {drawing.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-semibold">
                          {drawing.projects?.name || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(drawing.deleted_at || drawing.updated_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={async () => { await restoreDrawing(drawing); }}>
                              <RefreshCcw size={14} className="mr-1" /> Pulihkan
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDrawingPermanentDelete(drawing)}>
                              <TrashIcon size={14} className="mr-1" /> Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            </TabsContent>
            {/* Flowcharts Table */}
            <TabsContent value="flowcharts" className="mt-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Network size={18} className="text-green-400" />
                Flowchart
              </h3>
              <Badge variant="outline">{trashData.flowcharts?.length || 0} Item</Badge>
            </div>
            {!trashData.flowcharts || trashData.flowcharts.length === 0 ? (
              <div className="text-center py-12 border rounded-lg border-dashed text-muted-foreground">Tidak ada flowchart terhapus</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Ruang Kerja</TableHead>
                      <TableHead>Dihapus Pada</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trashData.flowcharts.map((flowchart) => (
                      <TableRow key={flowchart.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Network size={14} className="text-muted-foreground" />
                          {flowchart.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-semibold">
                          {flowchart.projects?.name || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(flowchart.deleted_at || flowchart.updated_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={async () => { await restoreFlowchart(flowchart); }}>
                              <RefreshCcw size={14} className="mr-1" /> Pulihkan
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleFlowchartPermanentDelete(flowchart)}>
                              <TrashIcon size={14} className="mr-1" /> Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
