"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/ui/dialog";
import { Search, X, Clock, TrendingUp, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "antd";
import { Trans, useTranslation } from "react-i18next";
import { useCategory } from "@/hooks/useCategory";
import { useProduct } from "@/hooks/useProducts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { useActiveCategories } = useCategory();
  const { useSearchProducts } = useProduct();
  const { data: categoriesData } = useActiveCategories();
  const categories = useMemo(() => categoriesData || [], [categoriesData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); 
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: searchResultsData, isLoading: isSearching } = useSearchProducts(debouncedQuery);
  const searchResults = useMemo(() => searchResultsData || [], [searchResultsData]);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const suggestedSearches = [
    "iPhone 17s Pro Max 256GB", "Camera Canon EOS HP", "iPhone 16 Pro Max 256GB",
    "Samsung Galaxy S24 Ultra 256GB"
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus({ cursor: 'end' });
      }, 100);
      const saved = localStorage.getItem("recentSearches");
      if (saved) setRecentSearches(JSON.parse(saved));
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
      setDebouncedQuery("");
    }
  }, [isOpen]);

  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  }, [recentSearches]);

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  const handleProductClick = (product: Product) => {
    saveRecentSearch(product.name);
    navigate(`/product/${product.slug?.current || product.slug || product._id}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideClose className="!max-w-2xl max-h-[70vh] p-0 overflow-hidden flex flex-col">
        
        <DialogHeader className="p-0 border-b shrink-0">
          <div className="flex items-center gap-2 p-4">
            <Input
              key="main-search-input"
              ref={inputRef}
              placeholder={t('search.placeholder')}
              value={searchQuery}
              autoComplete="off"
              suffix={
                searchQuery ? (
                  <X
                    className="w-4 h-4 cursor-pointer text-foreground hover:text-primary"
                    onClick={() => {
                      setSearchQuery("");
                      inputRef.current?.focus();
                    }}
                  />
                ) : <Search className="w-4 h-4 text-muted-foreground" />
              }
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-foreground h-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />

            <button
              onClick={onClose}
              className="p-1 cursor-pointer border border-border rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {searchQuery ? (
            <div key="search-results-section">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> 
                {isSearching ? t("search.searching") : t("search.results_count", { count: searchResults.length })}
              </h3>

              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {searchResults.slice(0, 8).map((p, i) => (
                        <motion.div
                          key={p._id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, delay: i * 0.03 }}
                        >
                          <Link
                            to={`/product/${p.slug?.current || p.slug}`}
                            onClick={() => handleProductClick(p)}
                            className="flex items-center gap-3 p-2 rounded-lg transition-colors group hover:bg-accent"
                          >
                            <div className="w-12 h-12 border border-border bg-white rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {p.name}
                              </h4>
                              <p className="text-xs text-muted-foreground truncate">
                                {p.category?.name} • {p.brand?.name}
                              </p>
                              <p className="text-sm font-bold text-primary">${p.price}</p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full p-2.5 mt-4 text-center bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    Xem tất cả {searchResults.length} kết quả →
                  </button>
                </>
              ) : (
                <div className="text-center py-12 text-foreground">
                  <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="font-medium">{t("search.no_results")}</p>
                </div>
              )}
            </div>
          ) : (
            <div key="suggestions-section" className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {t("search.recent")}
                    </h3>
                    <button onClick={clearRecentSearches} className="text-xs text-primary hover:underline">
                      {t("search.clear_all")}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="px-3 py-1 text-sm bg-accent border border-border rounded-full hover:bg-border transition-colors text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> {t("search.popular_categories")}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 4).map((c: any) => (
                    <button
                      key={c._id}
                      onClick={() => handleSuggestionClick(c.name)}
                      className="flex items-center gap-3 p-2 text-left hover:bg-accent rounded-lg transition-colors border border-border"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-8 h-8 object-cover rounded-full flex-none"
                      />
                      <span className="text-foreground text-sm font-medium truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  {t("search.suggestions")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all cursor-pointer font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-accent/50 rounded-xl p-4 border border-border/50">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <span className="text-primary">💡</span> {t("search.tips.title")}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <Trans i18nKey="search.tips.by_name">
                      Tìm theo <span className="font-medium text-foreground">tên</span>: "iPhone 15"
                    </Trans>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <Trans i18nKey="search.tips.by_brand">
                      Tìm theo <span className="font-medium text-foreground">nhãn hiệu</span>: "Apple"
                    </Trans>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;