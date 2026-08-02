import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Image, Music, Share2, Lock, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            ฟรี! สร้างหน้าเซอร์ไพรส์ได้ไม่จำกัด
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            สร้างความประทับใจ<br />ในแบบของคุณ
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            จดหมายดิจิทัล + รูป Polaroid + เพลง YouTube + แชร์ลิงก์<br />
            สร้างหน้าเซอร์ไพรส์สุดพิเศษให้คนพิเศษของคุณ
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                เริ่มสร้างเลย ✨
              </Button>
            </Link>
            <Link href="/s/demo">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full border-rose-200 hover:bg-rose-50">
                ดูตัวอย่าง
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">ทำไมต้อง SurpriseMe?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<Heart className="w-8 h-8 text-rose-500" />} title="จดหมายดิจิทัล" desc="เขียนข้อความจากหัวใจ พร้อม animation เปิดซองสุดเซอร์ไพรส์" />
            <FeatureCard icon={<Image className="w-8 h-8 text-pink-500" />} title="รูป Polaroid" desc="อัปโหลดรูปภาพความทรงจำในรูปแบบ Polaroid พร้อม Lightbox" />
            <FeatureCard icon={<Music className="w-8 h-8 text-purple-500" />} title="เพลงประกอบ" desc="เพิ่มบรรยากาศด้วยเพลงจาก YouTube ที่ผู้รับสามารถฟังได้ทันที" />
            <FeatureCard icon={<Share2 className="w-8 h-8 text-amber-500" />} title="แชร์ง่าย" desc="ลิงก์ + QR Code พร้อมตั้งค่ารหัสผ่านและวันหมดอายุ" />
            <FeatureCard icon={<Lock className="w-8 h-8 text-emerald-500" />} title="ความเป็นส่วนตัว" desc="ไม่เก็บ IP หรือ Fingerprint ผู้รับไม่ต้องล็อกอิน" />
            <FeatureCard icon={<Sparkles className="w-8 h-8 text-sky-500" />} title="ธีมสวยงาม" desc="หลากหลายธีมให้เลือก พร้อม animation ลื่นไหล" />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500">{desc}</p>
    </div>
  );
}
