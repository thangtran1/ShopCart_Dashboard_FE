"use client";

import { useEffect, useState } from "react";
import Title from "@/ui/title";
import { Link } from "react-router";
import SeeMore from "@/ui/see-more";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNews } from "@/hooks/useNews";
import { INews } from "@/api/services/newsApi";
import { Skeleton } from "antd";

const HomeNewsSection = () => {
  const { refreshNews, loading } = useNews();
  const [newsList, setNewsList] = useState<INews[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await refreshNews();
      if (res && res.success) {
        setNewsList(res.data.slice(0, 8));
      }
    };
    fetchData();
  }, [refreshNews]);

  if (loading && newsList.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex justify-between mb-4">
          <Skeleton.Input active size="small" />
          <Skeleton.Button active size="small" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} active avatar={{ shape: 'square', size: 'large' }} paragraph={{ rows: 2 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <Title className="text-xl font-bold uppercase tracking-wider text-foreground">
          Tin tức mới nhất
        </Title>
        <SeeMore to="/all-news">Xem tất cả</SeeMore>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {newsList.map((blog) => (
          <div
            key={blog._id}
            className="group rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <Link to={`/all-news/${blog.slug}`} className="block aspect-video relative overflow-hidden">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase px-2 py-1 rounded-md shadow-sm">
                {blog.category}
              </span>
            </Link>

            <div className="p-3 flex flex-col flex-1 gap-2">
              <Link to={`/all-news/${blog.slug}`}>
                <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[20px]">
                  {blog.title}
                </h3>
              </Link>

              <p className="text-xs text-muted-foreground line-clamp-2 italic">
                {blog.shortDescription}
              </p>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-auto pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <ClockCircleOutlined />
                    {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <EyeOutlined />
                  {blog.views}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeNewsSection;