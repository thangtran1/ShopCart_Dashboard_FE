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

  const featuredNews = useMemo(() => {
    return [...allNews].sort((a, b) => b.views - a.views).slice(0, 3);
  }, [allNews]);

  const trendingNews = useMemo(() => {
    return [...allNews].sort((a, b) => b.views - a.views).slice(0, 10);
  }, [allNews]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNews = allNews.slice(startIndex, startIndex + pageSize);

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
    <div>
      <h2 className="text-2xl font-bold my-4 flex items-center gap-2">
        {t("news_page.latest_title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        {featuredNews.map((news) => (
          <Link
            key={news._id}
            to={`/all-news/${news.slug}`}
            className="group relative border border-success/20 h-[220px] overflow-hidden rounded-xl shadow-md"
          >
            <img
              src={news.thumbnail}
              alt={news.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-foreground">
              <Badge className="mb-2 bg-primary border-none text-foreground">
                {news.category}
              </Badge>
              <h3 className="mb-2 line-clamp-2 text-lg text-white font-semibold leading-snug group-hover:text-muted-foreground transition-colors">
                {news.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <ClockCircleOutlined />
                  {formatDate(news.createdAt)}
                </span>
                <span>{news.views} {t("news_page.article.views")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {paginatedNews.map((news) => (
            <article
              key={news._id}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:shadow-lg hover:border-primary/30"
            >
              <Link to={`/all-news/${news.slug}`} className="flex flex-col sm:flex-row gap-5">
                <div className="relative h-[180px] w-full sm:w-[260px] flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={news.thumbnail}
                    alt={news.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-primary border-primary">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ClockCircleOutlined />
                      {formatDate(news.createdAt)}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>

                  <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {news.shortDescription}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Avatar size="small" icon={<UserOutlined />} />
                      <span className="font-medium">{t("news_page.article.admin")}</span>
                    </div>
                    <span className="text-xs text-muted-foreground italic">
                      {news.views} {t("news_page.article.views")}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}

          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={allNews.length}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              showSizeChanger={false}
            />
          </div>
        </div>

        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-4 py-4 bg-muted/50 border-b border-border flex items-center gap-2">
                <FireOutlined className="text-orange-500 text-lg" />
                <div>
                  <h3 className="font-bold text-sm uppercase">{t("news_page.trending.title")}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {t("news_page.trending.subtitle")}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border">
                {trendingNews.map((news, index) => (
                  <Link
                    key={news._id}
                    to={`/all-news/${news.slug}`}
                    className="group block px-4 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex gap-3">
                      <span className={`text-xl font-black ${index < 3 ? 'text-primary' : 'text-muted-foreground/30'} italic`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{news.category}</span>
                          <span className="flex items-center gap-0.5">
                            <ClockCircleOutlined className="scale-75" />
                            {formatDate(news.createdAt)}
                          </span>
                        </div>
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