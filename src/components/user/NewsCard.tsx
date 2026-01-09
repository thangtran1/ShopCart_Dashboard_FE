import Title from "@/ui/title";
import { Link } from "react-router";
import SeeMore from "@/ui/see-more";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { fakeBlogDetail } from "@/constants/fakeData";

const HomeNewsSection = () => {
  const blogs = fakeBlogDetail.slice(0, 5);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Title className="text-xl font-bold uppercase tracking-wider text-foreground">
          Tin tức
        </Title>
        <SeeMore to="/all-news">Xem thêm</SeeMore>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="group rounded-lg overflow-hidden border border-success/20 bg-muted shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {blog.image && (
              <Link to={`/all-news/${blog.slug}`} className="block h-40 relative">
                <img
                  src={blog.image.url}
                  alt={blog.image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {blog.category && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
                    {blog.category.name}
                  </span>
                )}
              </Link>
            )}

            <div className="p-2 flex flex-col gap-1">
              <Link to={`/all-news/${blog.slug}`}>
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:underline">
                  {blog.title}
                </h3>
              </Link>

              <p className="text-xs text-muted-foreground line-clamp-3">
                {blog.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {blog.author && (
                  <span className="flex items-center gap-1">
                    <UserOutlined className="text-xs" />
                    {blog.author.name}
                  </span>
                )}
                {blog.publishedAt && (
                  <span className="flex items-center gap-1">
                    <ClockCircleOutlined className="text-xs" />
                    {blog.publishedAt}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeNewsSection;
