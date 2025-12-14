"use client";

import { Avatar, Pagination } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Badge } from "@/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { Link } from "react-router";
import { fakeBlogDetail } from "@/constants/fakeData";

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const allNews = fakeBlogDetail;
  const featuredNews = fakeBlogDetail.filter((b) => b.isFeatured);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNews = allNews.slice(startIndex, endIndex);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Tin tức</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h2 className="text-2xl font-bold my-2"> TIN TỨC</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        {featuredNews.slice(0, 3).map((news) => (
          <Link
            key={news._id}
            to={`/all-news/${news.slug}`}
            className="group relative border border-success/20 h-[200px] overflow-hidden rounded-xl shadow-md cursor-pointer"
          >
            <img
              src={news.image.url}
              alt={news.image.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {news.category && (
                <div className="mb-2 inline-block rounded bg-primary px-2 py-0.5 text-xs font-medium">
                  {news.category.name}
                </div>
              )}
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug">
                {news.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-white/80">
                <div className="flex items-center gap-1">
                  <UserOutlined />
                  <span>{news.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockCircleOutlined />
                  <span>{news.publishedAt}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-1 flex flex-col gap-2">
          {paginatedNews.map((news) => (
            <article
              key={news._id}
              className="group rounded-xl border border-success/20 bg-muted p-4 transition-shadow hover:shadow-md"
            >
              <Link
                to={`/all-news/${news.slug}`}
                className="flex flex-col !text-foreground sm:flex-row gap-4"
              >
                <div className="relative border border-success/20 h-[160px] w-full sm:w-[240px] overflow-hidden rounded-lg">
                  <img
                    src={news.image.url}
                    alt={news.image.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  {news.category && (
                    <Badge variant={"success"}>{news.category.name}</Badge>
                  )}

                  <h3 className="line-clamp-2 text-lg font-semibold leading-snug group-hover:text-primary">
                    {news.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Avatar size="small" src={news.author.avatar} />
                      <span>{news.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockCircleOutlined />
                      <span>{news.publishedAt}</span>
                    </div>
                    <span>{news.views} lượt xem</span>
                  </div>

                  <p className="line-clamp-3 text-sm text-foreground/80">
                    {news.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}

          <div className="text-center mt-8">
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

        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-[100px]">
            <div className="rounded-xl border border-success/20 bg-muted shadow-sm">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-base">🔥 Xu hướng nổi bật</h3>
                <p className="text-xs text-muted-foreground">
                  Bài viết được quan tâm nhiều nhất
                </p>
              </div>

              <div className="max-h-[500px] overflow-y-auto divide-y divide-border">
                {allNews.map((news, index) => (
                  <Link
                    key={news._id}
                    to={`/all-news/${news.slug}`}
                    className="group block px-4 py-3 transition-colors !text-foreground hover:bg-background rounded"
                  >
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="success">{news.category.name}</Badge>
                      <span className="font-medium text-primary">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary">
                      {news.title}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ClockCircleOutlined className="text-foreground" />
                        {news.publishedAt}
                      </span>
                      <span>{news.views} lượt xem</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
