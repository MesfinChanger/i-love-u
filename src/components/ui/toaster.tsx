
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

/**
 * @fileOverview Universal Toast Dispatcher for the Prosperity Revolution.
 * Automatically injects a mandatory "Oky" action button for error (destructive) popups.
 * accessibility: Ensures all status updates are screen-reader compatible via ARIA live regions.
 */
export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isError = props.variant === 'destructive';
        
        return (
          <Toast 
            key={id} 
            {...props} 
            className={isError ? "bg-red-600 text-white border-none rounded-[2rem] shadow-2xl p-6" : "rounded-2xl shadow-xl p-6"}
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="font-black uppercase tracking-tight text-base leading-none mb-1">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="font-medium italic opacity-90 text-sm leading-relaxed">
                  {description}
                </ToastDescription>
              )}
            </div>
            
            <div className="flex flex-col gap-2 shrink-0">
              {/* Optional Custom Action */}
              {action}
              
              {/* Mandatory "Oky" Protocol for Errors */}
              {isError && (
                <ToastAction 
                  altText="Acknowledge and Close" 
                  onClick={() => dismiss(id)} 
                  className="bg-white/20 hover:bg-white/30 text-white border-none font-black uppercase text-[10px] tracking-[0.2em] h-10 px-5 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  Oky
                </ToastAction>
              )}
            </div>
            
            <ToastClose className={isError ? "text-white/50 hover:text-white" : ""} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
