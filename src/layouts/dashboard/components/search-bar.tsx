import { EmptyState } from "@/components/common/EmptyState";
import { Icon } from "@/components/icon";
import { useFlattenedRoutes, useRouter } from "@/router/hooks";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/ui/dialog"; 
import { Input } from "@/ui/input";
import { ScrollArea } from "@/ui/scroll-area";
import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useBoolean } from "react-use";
import styled from "styled-components";

const SearchBar = () => {
  const { t } = useTranslation();
  const { replace } = useRouter();
  const [search, toggle] = useBoolean(false);
  const flattenedRoutes = useFlattenedRoutes();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const processedRoutes = useMemo(() => {
    const map = new Map();
    flattenedRoutes.forEach((item) => {
      if (!item.label || item.hideMenu || item.key.includes(":") || item.key.includes("/error")) return;
      if (!map.has(item.key)) map.set(item.key, item);
    });
    return Array.from(map.values());
  }, [flattenedRoutes]);

  const visibleRoutes = useMemo(() => {
    return processedRoutes.filter(item => {
      const matchSearch = t(item.label).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.key.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (!searchQuery) {
        const depth = (item.key.match(/\//g) || []).length - 1;
        if (depth > 0) {
          const parentPath = item.key.substring(0, item.key.lastIndexOf('/'));
          return parentPath && expandedKeys.includes(parentPath);
        }
      }
      return true;
    });
  }, [searchQuery, processedRoutes, expandedKeys, t]);

  useEffect(() => { setSelectedIndex(0); }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!search) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % visibleRoutes.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + visibleRoutes.length) % visibleRoutes.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (visibleRoutes[selectedIndex]) handleItemClick(visibleRoutes[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [search, visibleRoutes, selectedIndex]);

  useEffect(() => {
    const activeItem = scrollRef.current?.children[selectedIndex] as HTMLElement;
    if (activeItem) activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  // Reset search text khi đóng/mở modal
  useEffect(() => {
    if (!search) {
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [search]);

  const checkHasChildren = (key: string) => {
    return processedRoutes.some(r => r.key.startsWith(key + "/") && r.key !== key);
  };

  const handleItemClick = (item: any) => {
    const hasChildren = checkHasChildren(item.key);
    if (!hasChildren || searchQuery) {
      goToPage(item.key);
    } else {
      toggleExpand(item.key);
    }
  };

  const goToPage = (key: string) => {
    replace(key);
    toggle(false);
    setSearchQuery("");
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderIcon = (item: any, isActive: boolean) => {
    const hasChildren = checkHasChildren(item.key);
    return (
      <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
        isActive ? 'bg-primary/20 text-primary' : 
        hasChildren ? 'bg-primary/60 text-foreground' : 'bg-primary/20 text-primary'
      }`}>
        {item.icon && typeof item.icon === 'string' ? <Icon icon={item.icon} size="18" /> : (item.icon || <Icon icon="solar:document-linear" size="18" />)}
      </div>
    );
  };

  return (
    <Dialog open={search} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="bg-secondary px-3 gap-2 cursor-pointer" onClick={() => toggle(true)}>
          <Icon icon="local:ic-search" size="20" />
          <kbd className="border px-1.5 rounded text-[10px]">⌘K</kbd>
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 w-[90vw] sm:max-w-2xl border-none shadow-2xl overflow-hidden bg-background rounded-xl">
        <DialogTitle className="sr-only">Hệ thống tìm kiếm menu</DialogTitle>
        <DialogDescription className="sr-only">Điều hướng bàn phím</DialogDescription>

        <div className="p-3 border-b flex items-center gap-3">
          <Icon icon="local:ic-search" size="22" className="!text-foreground" />
          <Input 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="border-none !text-foreground focus-visible:ring-0 text-lg !bg-transparent p-0 shadow-none h-auto caret-foreground"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[50vh]">
          {visibleRoutes.length === 0 ? <div className="px-4"><EmptyState height="sm" title="Trống" description="Rất tiếc, chúng tôi không tìm thấy nội dung nào khớp với từ khóa của bạn." /></div> : (
            <div className="flex flex-col gap-1 p-2" ref={scrollRef}>
              {visibleRoutes.map((item, index) => {
                const depth = (item.key.match(/\//g) || []).length - 1;
                const hasChildren = checkHasChildren(item.key);
                const isExpanded = expandedKeys.includes(item.key);
                const isActive = index === selectedIndex;

                return (
                  <StyledItem 
                    key={item.key} 
                    $depth={depth} 
                    $isActive={isActive}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-3 w-full group">
                      <div className="w-4 flex items-center justify-center">
                        {hasChildren && (
                          <Icon 
                            icon={isExpanded ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-right-bold"} 
                            size="12" 
                            className="!text-foreground"
                          />
                        )}
                      </div>

                      {renderIcon(item, isActive)}

                      <div className="flex flex-col overflow-hidden text-left">
                        <span className={`text-sm truncate text-foreground ${hasChildren ? "font-bold" : "font-medium"}`}>
                          {t(item.label)}
                        </span>
                        <span className="text-[9px] truncate tracking-tight text-foreground/60">
                          {item.key}
                        </span>
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        {hasChildren && !searchQuery && (
                          <Badge variant="warning" className="text-[9px] h-5">DANH MỤC</Badge>
                        )}
                        {isActive && (
                          <Badge variant="success" className="text-[10px] h-5 animate-in fade-in zoom-in-95 duration-200">
                            MỞ ↵
                          </Badge>
                        )}
                      </div>
                    </div>
                  </StyledItem>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-3 bg-secondary/30 border-t hidden sm:flex justify-start items-center">
          <div className="flex gap-4 text-[11px] text-foreground">
            <span className="flex items-center gap-1"><Badge variant="info" className="px-1 h-4">↑↓</Badge> Di chuyển</span>
            <span className="flex items-center gap-1"><Badge variant="info" className="px-1 h-4">↵</Badge> Chọn</span>
            <span className="flex items-center gap-1"><Badge variant="info" className="px-1 h-4">ESC</Badge> Đóng</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StyledItem = styled.div<{ $depth: number; $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  padding-left: ${props => props.$depth * 20 + 12}px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Màu nền Warning (Vàng/Cam nhạt) khi được chọn */
  background-color: ${props => props.$isActive ? 'rgba(255, 171, 0, 0.15)' : 'transparent'};
  border: 1px solid ${props => props.$isActive ? 'rgba(255, 171, 0, 0.3)' : 'transparent'};

  &:hover {
    background-color: rgba(255, 171, 0, 0.1);
  }
`;

export default SearchBar;