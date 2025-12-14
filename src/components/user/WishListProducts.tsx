"use client";

import useStore from "@/store/store";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Table, Button, Typography, Space, message, Popconfirm, Tooltip } from "antd";
import { Link } from "react-router";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/types";
import { ColumnType } from "antd/es/table";
import { toast } from "sonner";
import { Heart } from "lucide-react";

const { Title, Text } = Typography;

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  const handleResetWishlist = () => {
    if (window.confirm("Are you sure you want to reset your wishlist?")) {
      resetFavorite();
      toast.success("Wishlist reset successfully");
    }
  };

  const handleRemoveProduct = (id: string) => {
    removeFromFavorite(id);
    toast.success("Product removed from wishlist");
  };

  const columns: ColumnType<Product>[] = [
    {
      title: "Sản phẩm",
      dataIndex: "images",
      key: "images",
      render: (_images: any, record: any) => (
        <Space size={16} wrap align="center">
          <Link to={`/product/${record.slug}`}>
            <img
              src={
                record.image
                  ? record.image
                  : `${import.meta.env.VITE_API_URL}/${record.image}`
              }
              alt={record.name}
              className="h-16 w-16 object-cover rounded-md hover:scale-105 transition-transform"
            />
          </Link>
          <Text
            style={{
              maxWidth: 200,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {record.name}
          </Text>
        </Space>
      )
      ,
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category: any) => (
        <Text
          style={{
            maxWidth: 120,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {category?.name}
        </Text>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_: any, record: any) => <PriceFormatter amount={record.price} />,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Space size={8} wrap>
          <AddToCartButton product={record} className="w-full sm:w-auto" />

          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleRemoveProduct(record._id)}
          >
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
              />
            </Tooltip>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} className="mb-4">
        Danh sách yêu thích
      </Title>

      {favoriteProduct.length > 0 ? (
        <>
          <Table
            dataSource={favoriteProduct.slice(0, visibleProducts)}
            columns={columns}
            rowKey={(record: Product) => record._id}
            pagination={false}
            scroll={{ x: 600 }}
            size="middle"
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {visibleProducts < favoriteProduct.length && (
              <Button onClick={loadMore}>Load More</Button>
            )}
            {visibleProducts > 10 && (
              <Button onClick={() => setVisibleProducts(10)}>Load Less</Button>
            )}
            <Button danger onClick={handleResetWishlist}>
              Reset Wishlist
            </Button>
          </div>
        </>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 px-4 text-center">
          <div className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Danh sách yêu thích của bạn trống
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sản phẩm được thêm vào danh sách yêu thích của bạn sẽ hiện ở đây
            </p>
          </div>
          <Button type="default">
            <Link to="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WishListProducts;
