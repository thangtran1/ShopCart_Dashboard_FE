"use client";

import { Link } from "react-router";
import SeeMore from "@/ui/see-more";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "antd";
import { EmptyState } from "../common/EmptyState";
import { useTranslation } from "react-i18next";

const HomeNewsSection = () => {
  const { t, i18n } = useTranslation();
  const { usePublicNews } = useNews();
  const { data: newsList, isLoading } = usePublicNews();

  const formatDate = (dateString: string) => {
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    return new Date(dateString).toLocaleDateString(locale);
  };

  if (isLoading) {
    return (
      <div className="mb-10 mt-6">
        <div className="flex justify-between mb-6">
          <Skeleton.Input active size="large" style={{ width: 250 }} />
          <Skeleton.Button active size="small" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border rounded-xl p-3">
              <Skeleton.Image active className="!w-full !h-40 mb-3" />
              <Skeleton active paragraph={{ rows: 2 }} title={false} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between my-4">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t("news.title_main")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-500">
            {t("news.title_sub")}
          </span>
        </h2>
        <SeeMore to="/all-news">{t("news.see_all")}</SeeMore>
      </div>

      {(!newsList || newsList.length === 0) ? (
        <EmptyState
          height="sm"
          title={t("news.empty_title")}
          description={t("news.empty_description")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {newsList.slice(0, 8).map((blog) => (
            <div
              key={blog._id}
              className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <Link
                to={`/all-news/${blog.slug}`}
                className="block aspect-video relative overflow-hidden"
              >
                <img
                  src={blog.thumbnail || "/placeholder-news.jpg"}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-2 py-1 rounded-md shadow-sm">
                  {blog.category}
                </span>
              </Link>

              <div className="p-4 flex flex-col flex-1 gap-2">
                <Link to={`/all-news/${blog.slug}`}>
                  <h3 className="text-[15px] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[44px]">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-xs text-muted-foreground line-clamp-2 italic mb-2">
                  {blog.shortDescription}
                </p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-auto pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <ClockCircleOutlined className="text-[10px]" />
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <EyeOutlined className="text-[10px]" />
                    {blog.views || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeNewsSection;