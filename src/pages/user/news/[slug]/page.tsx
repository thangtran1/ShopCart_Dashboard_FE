"use client";

import { useParams } from "react-router";
import { ClockCircleOutlined, UserOutlined, EyeOutlined } from "@ant-design/icons";
import { Avatar, Skeleton } from "antd";
import { useNews } from "@/hooks/useNews"; 
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { Badge } from "@/ui/badge";
import RenderHtml from "@/pages/admin/news/components/render-html";
import { useTranslation } from "react-i18next"; 

const NewSlugDetail = () => {
  const { t, i18n } = useTranslation(); 
  const { slug } = useParams<{ slug: string }>();
  const { useNewsDetail } = useNews();
  const { data: news, isLoading } = useNewsDetail(slug || "");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      i18n.language === "vi" ? "vi-VN" : "en-US"
    );
  };

  if (!isLoading && !news) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        {t("news_detail.not_found")}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("breadcrumb.home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/all-news">{t("breadcrumb.news")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[200px]">
              {isLoading ? <Skeleton.Input active size="small" /> : news?.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton active paragraph={{ rows: 1 }} title={false} className="w-20" />
          <Skeleton active paragraph={{ rows: 2 }} title={true} />
          <div className="flex gap-4">
            <Skeleton.Avatar active size="small" />
            <Skeleton.Input active size="small" />
          </div>
          <Skeleton.Button active className="w-full h-[400px] rounded-2xl" />
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      ) : (
        <>
          <Badge variant={"success"} className="mb-1">
            {news?.category}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            {news?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-muted-foreground border-b pb-6">
            <div className="flex items-center gap-2">
              <Avatar size="small" icon={<UserOutlined />} />
              <span className="font-medium text-foreground">
                {t("news_detail.meta.author")} SHOP_CART_TVT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockCircleOutlined />
              {formatDate(news?.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <EyeOutlined />
              {news?.views} {t("news_detail.meta.views")}
            </div>
          </div>

          <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-lg mb-10 bg-muted">
            <img
              src={news?.thumbnail}
              alt={news?.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="text-xl font-medium text-muted-foreground mb-8 italic border-l-4 border-primary pl-4">
            {news?.shortDescription}
          </div>
          
          <RenderHtml content={news?.content || ""} />

          {news?.tags && news.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-foreground uppercase mr-1">
                {t("news_detail.tags")}
              </span>
              {news.tags.map((tag) => (
                <Badge key={tag} variant={'info'}>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewSlugDetail;