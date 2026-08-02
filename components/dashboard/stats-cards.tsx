import { Card, CardContent } from "@/components/ui/card";
import { FileText, Globe, Eye, MessageCircle } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    totalPages: number;
    publishedPages: number;
    totalViews: number;
    totalReactions: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    {
      title: "หน้าทั้งหมด",
      value: stats?.totalPages ?? 0,
      icon: FileText,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
    {
      title: "เผยแพร่แล้ว",
      value: stats?.publishedPages ?? 0,
      icon: Globe,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
    {
      title: "ยอดเปิดซอง",
      value: stats?.totalViews ?? 0,
      icon: Eye,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "ข้อความตอบกลับ",
      value: stats?.totalReactions ?? 0,
      icon: MessageCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="border-pink-100/80 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 tracking-tight">{item.value}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{item.title}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}