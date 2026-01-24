import { Modal, List, Tag, Divider } from "antd";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  data: any;
  onClose: () => void;
}

export default function ResponseDetailModal({ open, data, onClose }: Props) {
  if (!data) return null;

  return (
    <Modal
      title={<span className="text-lg font-bold uppercase italic">Chi tiết phản hồi khảo sát</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Ý kiến khách hàng:</p>
          <p className="text-base font-medium text-foreground italic">"{data.customerFeedback}"</p>
          <p className="text-[10px] text-muted-foreground mt-2">
            Gửi lúc: {dayjs(data.createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        </div>

        <Divider orientation="left" className="m-0 text-xs text-muted-foreground">
          CÁC CÂU TRẢ LỜI CỤ THỂ
        </Divider>

        <List
          dataSource={data.surveyData}
          renderItem={(item: any) => (
            <List.Item className="flex-col items-start border-none px-0 py-3">
              <p className="font-bold text-foreground mb-2">
                Q: {item.questionTitle || "Câu hỏi không xác định"}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.selectedOptions.map((opt: string, idx: number) => (
                  <Tag key={idx} color="red" className="rounded-md border-red-200">
                    {opt}
                  </Tag>
                ))}
              </div>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
}