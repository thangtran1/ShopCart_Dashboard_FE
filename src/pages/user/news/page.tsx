"use client";

import { Avatar, Pagination, Skeleton } from "antd";
import { ClockCircleOutlined, UserOutlined, FireOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { Badge } from "@/ui/badge";
import { Link } from "react-router";
import { useNews } from "@/hooks/useNews";
import { useTranslation } from "react-i18next";

export default function NewsPage() {
  const { usePublicNews } = useNews();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data: allNews = [], isLoading } = usePublicNews();

  const sortedByDate = useMemo(() => {
    return [...allNews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allNews]);

  const featuredNews = useMemo(() => {
    return sortedByDate.slice(0, 3);
  }, [sortedByDate]);

  const listNews = useMemo(() => {
    const featuredIds = new Set(featuredNews.map((n) => n._id));
    return sortedByDate.filter((n) => !featuredIds.has(n._id));
  }, [sortedByDate, featuredNews]);

  const trendingNews = useMemo(() => {
    const featuredIds = new Set(featuredNews.map((n) => n._id));
    return [...allNews]
      .filter((n) => !featuredIds.has(n._id))
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);
  }, [allNews, featuredNews]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNews = listNews.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US');
  };

  if (isLoading && allNews.length === 0) {
    return (
      <div className="space-y-6 mt-4">
        <Skeleton.Button active style={{ width: 200 }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton.Button key={i} active style={{ height: 220, width: '100%' }} />
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} active avatar paragraph={{ rows: 2 }} />
            ))}
          </div>
          <div className="w-80 hidden lg:block">
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h2 className="text-3xl font-extrabold my-6 flex items-center gap-3">
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("news_page.latest_title")}
        </span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
        {featuredNews.map((news, idx) => (
          <Link
            key={news._id}
            to={`/all-news/${news.slug}`}
            className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${idx === 0
                ? "lg:col-span-8 lg:row-span-2 h-[300px] lg:h-[456px]"
                : "lg:col-span-4 h-[220px]"
              }`}
          >
            <img
              src={news.thumbnail}
              alt={news.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 text-foreground">
              <Badge className="mb-3 bg-primary/90 hover:bg-primary border-none text-primary-foreground backdrop-blur-sm">
                {news.category}
              </Badge>
              <h3 className={`font-bold text-white drop-shadow-md leading-tight group-hover:text-primary-foreground/80 transition-colors ${idx === 0 ? "text-2xl lg:text-3xl line-clamp-3 mb-3" : "text-lg line-clamp-2 mb-2"
                }`}>
                {news.title}
              </h3>
              <div className="flex items-center gap-4 text-xs lg:text-sm text-white/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <ClockCircleOutlined />
                  {formatDate(news.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <FireOutlined />
                  {news.views} {t("news_page.article.views")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          {paginatedNews.map((news) => (
            <article
              key={news._id}
              className="group rounded-2xl border border-border/50 bg-card p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/40"
            >
              <Link to={`/all-news/${news.slug}`} className="flex flex-col sm:flex-row gap-6">
                <div className="relative h-[200px] w-full sm:w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
                  <img
                    src={news.thumbnail}
                    alt={news.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-md shadow-sm border-none">
                      {news.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col py-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                      <ClockCircleOutlined />
                      {formatDate(news.createdAt)}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-xl font-bold leading-snug group-hover:text-primary transition-colors mb-3">
                    {news.title}
                  </h3>

                  <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mb-4">
                    {news.shortDescription}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2.5">
                      <Avatar size="small" icon={<UserOutlined />} className="bg-primary/10 text-primary" />
                      <span className="text-xs font-semibold">{t("news_page.article.admin")}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <FireOutlined className="text-orange-500/70" />
                      {news.views} {t("news_page.article.views")}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}

          <div className="mt-6 flex justify-center pb-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={listNews.length}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        </div>

        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-card to-background shadow-lg overflow-hidden relative">
              <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-red-500 to-primary"></div>

              <div className="p-5 flex items-center gap-3 border-b border-border/40 bg-muted/20">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-xl shadow-inner text-white">
                  <FireOutlined className="text-xl" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">{t("news_page.trending.title")}</h3>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
                    {t("news_page.trending.subtitle")}
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {trendingNews.map((news, index) => (
                  <Link
                    key={news._id}
                    to={`/all-news/${news.slug}`}
                    className="group flex gap-4 items-center relative p-2 -mx-2 rounded-xl hover:bg-muted/60 transition-colors"
                  >
                    <div className="relative h-20 w-24 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={news.thumbnail}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-0 left-0 bg-gradient-to-br from-orange-500 to-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg shadow-sm">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <h4 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center text-[11px] text-muted-foreground font-medium">
                        <ClockCircleOutlined className="mr-1 scale-90" />
                        {formatDate(news.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}