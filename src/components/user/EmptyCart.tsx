"use client";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Typography } from "antd";
import emptyCart from "@/assets/images/emptyCart.png";
const { Title } = Typography;

export default function EmptyCart() {
  return (
    <div>
      <Title level={3} className="mb-4">
        Giỏ hàng của bạn
      </Title>
      <div className="flex max-w-lg mx-auto rounded-md items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-4 w-full space-y-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
            className="relative w-32 h-32 mx-auto"
          >
            <img
              src={emptyCart}
              alt="Empty shopping cart"
              className="drop-shadow-lg"
            />
            <motion.div
              animate={{
                x: [0, -10, 10, 0],
                y: [0, -5, 5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              }}
              className="absolute -top-4 -right-4 bg-primary/70 rounded-full p-2"
            >
              <ShoppingCart size={24} />
            </motion.div>
          </motion.div>

          <div className="text-center space-y-2 mb-5">
            <h2 className="text-2xl font-bold">
              Giỏ hàng của bạn đang trống!
            </h2>
            <p className="text-sm text-muted-foreground">
              Sản phẩm được thêm vào giỏ hàng của bạn sẽ hiện ở đây
            </p>
          </div>
          <div>
            <Link
              to="/shop"
              className="block bg-primary/70 border border-primary/20 text-center py-2 rounded-full text-sm font-semibold -wide hover:text-primary hover:border-primary hover:bg-primary"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
