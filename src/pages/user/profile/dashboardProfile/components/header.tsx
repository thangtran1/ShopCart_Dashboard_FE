export function Header() {
  return (
    <div className="border-b">
      <div className="py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* ===== LEFT: USER INFO ===== */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 font-semibold text-lg">LH</span>
            </div>

            {/* Info */}
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-semibold truncate">
                Lê Hồng Quang
              </h1>
              <p className="text-sm text-gray-500 truncate">
                036••••96 · 📞
              </p>

              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-600">
                S-NULL
              </span>
            </div>
          </div>

          {/* ===== RIGHT: STATS ===== */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8">
            
            {/* Orders */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <span className="text-lg">🛒</span>
              </div>

              <div>
                <p className="text-lg font-semibold leading-none">3</p>
                <p className="text-xs text-gray-500 mt-1">
                  Đơn hàng đã mua
                </p>
              </div>
            </div>

            {/* Spending */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <span className="text-lg">🕒</span>
              </div>

              <div className="min-w-0">
                <p className="text-lg font-semibold leading-none">
                  0đ
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Cần thêm 3.000.000đ để lên S-NEW
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
