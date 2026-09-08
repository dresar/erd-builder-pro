import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps, toast } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const recentToasts = new Map<string, number>();
const DEDUP_WINDOW_MS = 2000;

const createDedupMethod = (originalFn: any) => {
  return (message: any, data?: any) => {
    const key = typeof message === 'string' ? message : (message?.toString?.() || JSON.stringify(message));
    const now = Date.now();
    const lastTime = recentToasts.get(key) || 0;
    
    if (now - lastTime < DEDUP_WINDOW_MS) {
      return originalFn(message, { id: key, ...data });
    }
    
    recentToasts.set(key, now);
    if (recentToasts.size > 50) {
      for (const [k, time] of recentToasts.entries()) {
        if (now - time > 10000) recentToasts.delete(k);
      }
    }
    return originalFn(message, { id: data?.id ?? key, ...data });
  };
};

if (typeof toast !== 'undefined' && !(toast as any).__dedup_patched__) {
  (toast as any).__dedup_patched__ = true;
  toast.success = createDedupMethod(toast.success.bind(toast));
  toast.error = createDedupMethod(toast.error.bind(toast));
  toast.info = createDedupMethod(toast.info.bind(toast));
  toast.warning = createDedupMethod(toast.warning.bind(toast));
  toast.message = createDedupMethod(toast.message.bind(toast));
}

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      visibleToasts={3}
      duration={2500}
      closeButton
      className="toaster group"
      richColors
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { toast }
