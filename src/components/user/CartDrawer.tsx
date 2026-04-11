import { Drawer, Empty, Progress } from "antd";
import { Link, useNavigate } from "react-router";
import { useCart } from "@/hooks/useCart";
import { useCartDrawerOpen, useCartUIActions } from "@/store/cartUIStore";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { Button } from "@/ui/button";
import { ShoppingBag, X } from "lucide-react";
import { ScrollArea } from "@/ui/scroll-area";

const FREE_SHIP_THRESHOLD = 500000; // 500,000 VND

const CartDrawer = () => {
  const isOpen = useCartDrawerOpen();
  const { closeDrawer } = useCartUIActions();
  const { items, totalAmount, removeItem } = useCart();
  const navigate = useNavigate();

  const progressPercent = Math.min((totalAmount / FREE_SHIP_THRESHOLD) * 100, 100);
  const remainingForFreeship = FREE_SHIP_THRESHOLD - totalAmount;

  const handleCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate("/cart");
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2 text-primary font-bold text-lg">
          <ShoppingBag className="w-5 h-5" />
          Giỏ hàng của bạn 
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full ml-1">
            {items?.length || 0}
          </span>
        </div>
      }
      placement="right"
      onClose={closeDrawer}
      open={isOpen}
      width={400}
      closeIcon={<X className="w-5 h-5" />}
      styles={{
        header: { borderBottom: '1px solid #f1f5f9', padding: '16px 20px' },
        body: { padding: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' },
      }}
      className="cart-drawer-custom"
    >
      {/* Freeship Progress Section */}
      <div className="bg-white p-4 border-b shadow-sm z-10">
        {totalAmount >= FREE_SHIP_THRESHOLD ? (
          <div className="text-sm font-semibold text-emerald-600 mb-1 flex items-center gap-1">
            🎉 Xin chúc mừng! Bạn đã được MIỄN PHÍ VẬN CHUYỂN!
          </div>
        ) : (
          <div className="text-sm font-medium text-slate-600 mb-1">
            Mua thêm <span className="text-red-500 font-bold"><PriceFormatter amount={remainingForFreeship} /></span> để được Quà tặng / Freeship.
          </div>
        )}
        <Progress 
          percent={progressPercent} 
          showInfo={false} 
          strokeColor={totalAmount >= FREE_SHIP_THRESHOLD ? "#10b981" : "#f43f5e"}
          className="m-0"
          size="small"
        />
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 p-4">
        {!items?.length ? (
          <div className="h-full flex flex-col items-center justify-center pt-10">
            <Empty 
              description={<span className="text-slate-400">Giỏ hàng của bạn đang trống</span>} 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button onClick={closeDrawer} variant="outline" className="mt-4 rounded-xl">
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item: any) => (
              <div key={item.product._id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-3 relative group">
                <button 
                  onClick={() => removeItem(item.product._id)}
                  className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm border rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <X className="w-3 h-3" />
                </button>
                
                <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between py-0.5">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
                      <Link to={`/product/${item.product.slug}`} onClick={closeDrawer} className="hover:text-primary transition-colors">
                        {item.product.name}
                      </Link>
                    </h4>
                    <div className="text-red-500 font-bold text-sm mt-1">
                      <PriceFormatter amount={item.product.price} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <QuantityButtons product={item.product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer Checkout */}
      {items?.length > 0 && (
        <div className="bg-white border-t p-5 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Tổng tiền dự kiến:</span>
            <span className="text-xl font-black text-red-600">
              <PriceFormatter amount={totalAmount} />
            </span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 cursor-pointer rounded-xl h-12 text-primary border-primary/20 hover:bg-primary/5 font-semibold"
              onClick={handleViewCart}
            >
              Xem Giỏ Hàng
            </Button>
            <Button 
              className="flex-1 cursor-pointer rounded-xl h-12 bg-red-500 hover:bg-red-600 font-bold text-white shadow-md shadow-red-500/20"
              onClick={handleCheckout}
            >
              Thanh Toán Ngay
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
