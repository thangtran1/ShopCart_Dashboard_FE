import { cn } from "@/lib/utils"; 

interface RenderHtmlProps {
  content: string;
  className?: string;
}

export default function RenderHtml({ content, className }: RenderHtmlProps) {
  return (
    <div
      className={cn(
        "prose prose-indigo max-w-none",
        /* --- Typography --- */
        "[&>p]:text-foreground [&>p]:leading-[1.8] [&>p]:mb-6 [&>p]:text-[15px]",
        "[&>h1]:text-4xl [&>h1]:font-black [&>h1]:text-primary [&>h1]:mb-8 [&>h1]:tracking-tight",
        "[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:border-b [&>h2]:pb-2 [&>h2]:border-border",
        "[&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-8 [&>h3]:mb-3",
        
        /* --- List & Bullet --- */
        "[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2 [&>li]:text-foreground",
        "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2",
        
        /* --- Blockquote --- */
        "[&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:bg-primary/5 [&>blockquote]:rounded-r-xl [&>blockquote]:py-4 [&>blockquote]:my-10 [&>blockquote]:text-lg [&>blockquote]:text-foreground/90",
        
        /* --- Media --- */
        "[&>img]:rounded-3xl [&>img]:my-10 [&>img]:shadow-2xl [&>img]:mx-auto [&>img]:border [&>img]:border-border",
        
        /* --- Link & Inline Style --- */
        "[&>a]:text-primary [&>a]:font-bold [&>a]:underline [&>a]:decoration-primary/30 hover:[&>a]:decoration-primary transition-all",
        "[&>strong]:font-black [&>strong]:text-foreground",
        "[&>code]:bg-primary/10 [&>code]:text-primary [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-sm [&>code]:font-mono",
        
        /* --- Table Pro --- */
        "[&>table]:w-full [&>table]:my-8 [&>table]:border-separate [&>table]:border-spacing-0 [&>table]:rounded-2xl [&>table]:border [&>table]:border-border [&>table]:overflow-hidden [&>table]:shadow-sm",
        "[&>table_thead]:bg-primary/10",
        "[&>table_th]:p-4 [&>table_th]:text-left [&>table_th]:text-primary [&>table_th]:text-xs [&>table_th]:font-black [&>table_th]:uppercase [&>table_th]:tracking-wider [&>table_th]:border-b [&>table_th]:border-border",
        "[&>table_td]:p-4 [&>table_td]:text-sm [&>table_td]:text-foreground/80 [&>table_td]:border-b [&>table_td]:border-border",
        "[&>table_tr:last-child_td]:border-b-0 hover:[&>table_tr]:bg-primary/5 transition-colors",
        
        /* --- Hệ thống màu sắc Helper --- */
        "[&_.text-red]:text-red-500 [&_.bg-red]:bg-red-500/10 [&_.bg-red]:px-1 [&_.bg-red]:rounded",
        "[&_.text-blue]:text-blue-500 [&_.bg-blue]:bg-blue-500/10 [&_.bg-blue]:px-1 [&_.bg-blue]:rounded",
        "[&_.text-green]:text-green-500 [&_.bg-green]:bg-green-500/10 [&_.bg-green]:px-1 [&_.bg-green]:rounded",
        "[&_.text-yellow]:text-yellow-600 [&_.bg-yellow]:bg-yellow-500/20 [&_.bg-yellow]:px-1 [&_.bg-yellow]:rounded",
        "[&_.highlight]:bg-yellow-200 [&_.highlight]:text-black [&_.highlight]:px-1 [&_.highlight]:font-bold",
        
        /* --- Divider --- */
        "[&>hr]:my-12 [&>hr]:border-0 [&>hr]:h-px [&>hr]:bg-gradient-to-r [&>hr]:from-transparent [&>hr]:via-border [&>hr]:to-transparent",
        className
      )}
      dangerouslySetInnerHTML={{
        __html: content || "<p class='text-center py-20 opacity-50 italic'>Nội dung đang trống...</p>",
      }}
    />
  );
}