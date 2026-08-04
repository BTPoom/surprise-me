import { Card, CardContent } from "@/components/ui/card";
import { FileText, Globe, Eye, MessageCircle } from "lucide-react";

interface StatsCardsProps {
  stats?: {
    total?: number;
    published?: number;
    opens?: number;
    reactions?: number;
    totalPages?: number;
    publishedPages?: number;
    totalViews?: number;
    totalReactions?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const total = stats?.total ?? stats?.totalPages ?? 0;
  const published = stats?.published ?? stats?.publishedPages ?? 0;
  const opens = stats?.opens ?? stats?.totalViews ?? 0;
  const reactions = stats?.reactions ?? stats?.totalReactions ?? 0;

  const items = [
    { title: "หน้าทั้งหมด", value: total, icon: FileText, color: "text-rose-500", bgColor: "bg-rose-50" },
    { title: "เผยแพร่แล้ว", value: published, icon: Globe, color: "text-pink-500", bgColor: "bg-pink-50" },
    { title: "ยอดเปิดซอง", value: opens, icon: Eye, color: "text-purple-500", bgColor: "bg-purple-50" },
    { title: "ข้อความตอบกลับ", value: reactions, icon: MessageCircle, color: "text-amber-500", bgColor: "bg-amber-50" },
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
