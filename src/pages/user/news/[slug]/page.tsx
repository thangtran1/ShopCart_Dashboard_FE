import { useParams } from "react-router";
import {
  ClockCircleOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useNews } from "@/hooks/useNews"; 
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { INews } from "@/api/services/newsApi";
import { Badge } from "@/ui/badge";

const NewSlugDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getNewsDetail } = useNews();
  const [news, setNews] = useState<INews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (slug) {
        setLoading(true);
        const data = await getNewsDetail(slug);
        setNews(data);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Bài viết không tồn tại hoặc đã bị gỡ bỏ.
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/all-news">Tin tức</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[200px]">
              {news.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Badge variant={"success"} className="mb-1">
        {news.category}
      </Badge>

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
        {news.title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-muted-foreground border-b pb-6">
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <span className="font-medium text-foreground">
            Admin SHOP_CART_TVT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ClockCircleOutlined />
          {new Date(news.createdAt).toLocaleDateString("vi-VN")}
        </div>
        <div className="flex items-center gap-2">
          <EyeOutlined />
          {news.views} lượt xem
        </div>
      </div>

      <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-lg mb-10">
        <img
          src={news.thumbnail}
          alt={news.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="text-xl font-medium text-muted-foreground mb-8 italic border-l-4 border-primary pl-4">
        {news.shortDescription}
      </div>

      <div
        className="prose prose-slate dark:prose-invert max-w-none 
                   text-foreground text-lg leading-relaxed
                   [&>p]:mb-4 [&>img]:rounded-xl [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {news.tags && news.tags.length > 0 && (
        <div className="mt-6 pt-6 border-t flex items-center gap-2">
          <span className="text-sm font-bold text-foreground uppercase">
            Tags:
          </span>
          {news.tags.map((tag) => (
            <Badge key={tag} variant={'info'}>
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewSlugDetail;
