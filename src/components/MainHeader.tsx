import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CloudOff, Cloud, Save, Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShareModal } from "./modals/ShareModal";
import { NavActionsMenu } from "./NavActionsMenu";
import { useAIAction } from '@/contexts/AIActionContext';
import { AppView } from '@/types';

interface MainHeaderProps {
  featureLabel?: string;
  activeProjectName?: string | null | undefined;
  activeFileName?: string | null | undefined;
  view: AppView;
  hasActiveItem?: boolean;
  syncError?: boolean;
  isSyncing?: boolean;
  isRefreshing?: boolean;
  isLocalSaving?: boolean;
  hasPendingSyncs?: boolean;
  activeFileUid?: string;
  activeFileId?: number | string | null;
  initialShareSettings?: {
    is_public: boolean;
    share_token?: string;
    expiry_date?: string;
  };
  onSettingsSaved?: () => void;
  isPublicView?: boolean;
  isOnline: boolean;
  updatedAt?: string;
  onDelete?: () => void;
  onRename?: () => void;
  onSave?: () => void;
  onExportAll?: () => void;
  onExportSQL?: (dialect: 'postgresql' | 'mysql') => void;
  onExportImage?: () => void;
  onExportMarkdown?: () => void;
  onCopyMarkdown?: () => void;
  onImportMarkdown?: () => void;
  onDuplicate?: () => void;
  isGuest?: boolean;
  breadcrumbLabel?: string | null;
  noteContent?: string;
  historyAvailable?: boolean;
}

export const MainHeader = React.memo(({
  view,
  syncError,
  isSyncing,
  isRefreshing,
  isLocalSaving = false,
  hasPendingSyncs,
  activeFileUid,
  activeFileId,
  activeFileName,
  initialShareSettings,
  onSettingsSaved,
  isPublicView = false,
  isOnline,
  onDelete,
  onRename,
  onSave,
  onExportAll,
  onExportSQL,
  onExportImage,
  onExportMarkdown,
  onCopyMarkdown,
  onImportMarkdown,
  onDuplicate,
  isGuest = false,
  noteContent,
  historyAvailable = true,
}: MainHeaderProps) => {
  const location = useLocation();
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const { setRightPanelMode } = useAIAction();
  const [isMac, setIsMac] = React.useState(false);
  const historyEntityType = view === 'erd'
    ? 'diagrams'
    : view === 'flowchart'
      ? 'flowcharts'
      : view === 'notes' || view === 'drawings'
        ? view
        : null;
  const historyEnabled = Boolean(
    historyAvailable && historyEntityType && activeFileUid && !isGuest && !isPublicView && isOnline
    && !isLocalSaving && !isSyncing && !hasPendingSyncs,
  );

  const openHistory = React.useCallback(() => setRightPanelMode('history'), [setRightPanelMode]);

  React.useEffect(() => {
    setIsMac(window.navigator.userAgent.toLowerCase().includes('mac'));
  }, []);

  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-2 w-full overflow-hidden border-b bg-background/50 backdrop-blur-sm px-3">
      <div className="flex items-center gap-2 min-w-0 flex-none">
        {!isPublicView && (
          <SidebarTrigger className="-ml-1 size-8 shrink-0" />
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-2">
        {!isOnline && !isPublicView ? (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-semibold">
            <div className="size-1.5 rounded-full bg-destructive animate-pulse" />
            <span>Offline</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {!!location.pathname.match(/^\/(notes|prd|diagrams|drawings|flowcharts)\/[^/]+$/) && (
          <div className="flex items-center gap-1 sm:gap-2">
            {!isPublicView && (
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                {isLocalSaving ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" />
                  </div>
                ) : syncError ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[11px] font-medium">
                    <CloudOff className="size-3.5" />
                  </div>
                ) : isSyncing ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground">
                    <Cloud className="size-3.5" />
                  </div>
                ) : hasPendingSyncs ? (
                  <TooltipProvider delay={0}>
                    <Tooltip>
                      <TooltipTrigger render={
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onSave}
                          disabled={!isOnline}
                          className="h-7 px-2 gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium rounded-md"
                        >
                          <Save className="size-3.5" />
                          <span>Simpan</span>
                        </Button>
                      } />
                      <TooltipContent side="bottom" className="text-[10px] font-medium">
                        <div className="flex flex-col items-center gap-0.5">
                          <span>Simpan ke cloud</span>
                          <span className="opacity-50 text-[9px]">{isMac ? '⌘' : 'Ctrl'} + S</span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground">
                    <Check className="size-3.5 text-emerald-500" />
                  </div>
                )}

                {isRefreshing && (
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin ml-1" />
                )}
              </div>
            )}

            <NavActionsMenu 
              onShare={() => isOnline && setIsShareModalOpen(true)}
              onDelete={onDelete}
              onRename={onRename}
              onDuplicate={onDuplicate}
              onExportAll={onExportAll}
              onExportSQL={onExportSQL}
              onExportImage={onExportImage}
              onExportMarkdown={onExportMarkdown}
              onCopyMarkdown={onCopyMarkdown}
              onImportMarkdown={onImportMarkdown}
              isOnline={isOnline}
              isPublicView={isPublicView}
              isPublic={initialShareSettings?.is_public}
              activeFileUid={activeFileUid}
              documentType={view}
              noteContent={noteContent}
              historyEnabled={historyEnabled}
              onOpenHistory={isGuest || isPublicView ? undefined : openHistory}
            />

            {activeFileUid && activeFileId && isOnline && (
              <ShareModal 
                isOpen={isShareModalOpen} 
                onOpenChange={setIsShareModalOpen}
                documentType={view as any}
                documentUid={activeFileUid}
                documentId={activeFileId}
                documentTitle={activeFileName || 'Untitled'}
                isPublicView={isPublicView}
                initialSettings={initialShareSettings}
                onSettingsSaved={onSettingsSaved}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
});
