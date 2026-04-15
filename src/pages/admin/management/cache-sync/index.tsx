import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Row, List, Typography, Space, Tag } from 'antd';
import { clearSystemCache, getSystemCacheStatus } from '@/api/services/profileApi';
import { toast } from 'sonner';
import { Icon } from '@/components/icon';
import { CardTitle } from '@/ui/card';
import { Separator } from '@/ui/separator';

const { Text, Paragraph } = Typography;

export default function CacheSyncManagement() {
  const { data: cacheStatus, isLoading: isLoadingStatus, refetch } = useQuery({
    queryKey: ['systemCacheStatus'],
    queryFn: getSystemCacheStatus,
  });

  const { mutateAsync: performClearCache, isPending: isClearing } = useMutation({
    mutationFn: () => clearSystemCache(),
    onSuccess: (data) => {
      if (data.success) {
         toast.success(data.message || "Cache cleared successfully");
         refetch(); // Refresh cache status
      } else {
         toast.error(data.message || "Failed to clear cache");
      }
    },
    onError: (error: Error) => {
      console.error("Clear cache failed:", error);
      toast.error('Có lỗi xảy ra khi dọn dẹp Cache');
    },
  });

  return (
    <div className="bg-card text-card-foreground p-4 flex flex-col gap-6 rounded-xl border shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon icon="lucide:database-zap" className="h-7 w-7 text-primary" />
              Quản lý Cache & Đồng bộ (System Cache)
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Quản lý và kích hoạt lưu trữ đệm dữ liệu vào RAM để tối ưu hiệu suất truy xuất hệ thống.
            </p>
          </div>
        </div>

        <Separator className="my-0" />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={14}>
            <Card 
              title={
                <Space>
                  <Icon icon="lucide:database-zap" size="20" />
                  Thông tin Cache đang được lưu trữ trong RAM
                </Space>
              } 
              className="h-full shadow-sm"
            >
              <Paragraph className="text-muted-foreground mb-4">
                Dưới đây là danh sách các vùng dữ liệu (Keys) hiện đang được lưu trên RAM (Bộ nhớ đệm). Hệ thống sẽ sử dụng vùng đệm này thay vì gọi vào CSDL MongoDB để tăng tốc đáng kể tốc độ load tải.
              </Paragraph>
              <List
                loading={isLoadingStatus}
                bordered
                dataSource={cacheStatus?.data || []}
                renderItem={(item) => (
                  <List.Item className="flex justify-between items-center">
                    <div>
                      <Text strong className="block mb-1">
                        <Icon icon="lucide:database" className="mr-2 inline text-muted-foreground" size="16" />
                        {item.name}
                      </Text>
                      <Text type="secondary" className="text-xs font-mono ml-6 block">
                        {item.key}
                      </Text>
                    </div>
                    <div>
                      {item.synced ? (
                        <Tag color="success" icon={<Icon icon="lucide:check-circle" className="mr-1" inline />}>
                          Đã Sync (Cached)
                        </Tag>
                      ) : (
                        <Tag color="warning" icon={<Icon icon="lucide:alert-circle" className="mr-1" inline />}>
                          Chưa Sync / Có cập nhật
                        </Tag>
                      )}
                    </div>
                  </List.Item>
                )}
                locale={{ emptyText: 'Chưa có thông tin Cache.' }}
              />
               <Button className="mt-4" onClick={() => refetch()} loading={isLoadingStatus} icon={<Icon icon="lucide:refresh-cw" />}>
                  Làm mới danh sách
               </Button>
            </Card>
          </Col>

          <Col xs={24} md={10}>
            <Card 
              title={
                <Space className="text-error">
                  <Icon icon="lucide:alert-triangle" size="20" />
                  Hành động khẩn cấp
                </Space>
              } 
              className="h-full shadow-sm border-error/50"
            >
              <div className="flex flex-col gap-4">
                <Paragraph className="text-muted-foreground">
                  <Text strong>Tối ưu/Đồng bộ Cứng (Warm-up):</Text> Xóa toàn bộ Cache trên hệ thống sẽ kích hoạt đồng bộ lại dữ liệu từ phiên bản mới nhất trên Database lên bộ nhớ RAM ngay lập tức. Dùng khi bạn thấy dữ liệu trên UI bị treo hoặc sai lệch số liệu doanh thu.
                </Paragraph>
                
                <Button 
                  loading={isClearing} 
                  danger 
                  type="primary"
                  onClick={() => performClearCache()} 
                  size="large"
                  className="w-full flex items-center justify-center font-semibold"
                  icon={<Icon icon="lucide:trash-2" />}
                >
                  Làm sạch & Bắt đầu Đồng bộ lại
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

