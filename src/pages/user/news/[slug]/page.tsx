import { useParams } from "react-router";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { fakeBlogDetail } from "@/constants/fakeData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";

const NewSlugDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const news = fakeBlogDetail.find((item) => item.slug === slug);

  if (!news) {
    return (
      <div className="text-center py-10 text-lg">Bài viết không tồn tại</div>
    );
  }

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

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{slug}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="text-2xl font-bold my-2">Chi tiết tin tức</h2>

      <div className=" h-[400px] overflow-hidden rounded-lg">
        <img
          src={news.image?.url}
          alt={news.image?.alt || news.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl mt-2 font-bold mb-4">{news.title}</h1>
      <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            src={news.author?.avatar}
            icon={<UserOutlined />}
          />
          {news.author?.name}
        </div>
        <div className="flex items-center gap-2">
          <ClockCircleOutlined />
          {news.publishedAt}
        </div>
      </div>

      <div
        className="text-foreground text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </div>
  );
};

export default NewSlugDetail;
