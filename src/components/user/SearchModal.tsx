"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/ui/dialog";
import { Search, X, Clock, TrendingUp, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "antd";
import { productService } from "@/api/services/product";
import { categoryService } from "@/api/services/category";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    if (!isOpen) return;
    const fetchCategories = async () => {
      const response = await categoryService.getActive();
      setCategories(response.data);
    };
    fetchCategories();
  }, [isOpen]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedSearches = [
    "iPhone 17s Pro Max 256GB", "Camera Canon EOS HP", "iPhone 16 Pro Max 256GB",
    "Samsung Galaxy S24 Ultra 256GB"
  ];

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isOpen]);

  // Perform search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) return setSearchResults([]);
      setIsLoading(true);
      const response = await productService.getActiveProducts();
      const allProducts = response.data;

      const filtered = allProducts.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered.slice(0, 8) as any);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  const handleProductClick = (product: Product) => {
    saveRecentSearch(product.name);
    navigate(`/product/${product.slug?.current || product._id}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideClose className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-0">
          <div className="flex items-center gap-2 p-4 border-b">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              suffix={
                searchQuery ? (
                  <X
                    className="w-4 h-4 cursor-pointer text-foreground hover:text-primary"
                    onClick={() => setSearchQuery("")}
                  />
                ) : null
              }
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />

            <button
              onClick={onClose}
              className="p-1 cursor-pointer border border-border rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4 space-y-6">
          {/* Search Results */}
          {searchQuery ? (
            <>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Kết quả tìm kiếm ({searchResults.length})
              </h3>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-foreground">Đang tìm kiếm...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <AnimatePresence>
                    <div className="space-y-2">
                      {searchResults.map((p, i) => (
                        <motion.div
                          key={p._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            to={`/product/${p.slug}`}
                            onClick={() => handleProductClick(p)}
                            className="flex items-center gap-3 p-3 rounded-lg transition-colors group"
                          >
                            <div className="w-12 border border-border h-12 bg-background rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {p.name}
                              </h4>
                              <p className="text-sm text-foreground truncate">
                                {p.category?.name} • {p.brand?.name}
                              </p>
                              <p className="text-sm font-semibold text-primary">${p.price}</p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full p-3 mt-4 text-center bg-primary hover:bg-primary/80 text-foreground rounded-lg transition-colors font-medium"
                  >
                    Xem tất cả {searchResults.length} kết quả →
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-foreground">
                  <Search className="w-12 h-12 mx-auto mb-2 text-foreground" />
                  <p>Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm">Thử tìm kiếm với từ khóa khác</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Tìm kiếm gần đây
                    </h3>
                    <button onClick={clearRecentSearches} className="text-xs text-primary hover:underline">
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="flex cursor-pointer items-center gap-3 w-full p-2 text-left hover:bg-background rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4 text-foreground" />
                        <span className="text-foreground">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Danh mục phổ biến
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(c.name)}
                      className="flex cursor-pointer items-center gap-3 p-3 text-left hover:bg-background rounded-lg transition-colors border border-border"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-10 h-10 object-cover rounded-full flex-none"
                      />
                      <span className="text-foreground font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Searches */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  Gợi ý tìm kiếm
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="p-2 text-sm bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Tips */}
              <div className="bg-background/80 dark:bg-background/70 rounded-xl p-5 border border-border/50 shadow-sm">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <span className="text-primary">💡</span> Mẹo tìm kiếm
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tìm theo <span className="font-medium text-foreground">tên sản phẩm</span>: "iPhone 15"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tìm theo <span className="font-medium text-foreground">thương hiệu</span>: "Samsung", "Apple"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tìm theo <span className="font-medium text-foreground">danh mục</span>: "Laptop", "Headphones"</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
