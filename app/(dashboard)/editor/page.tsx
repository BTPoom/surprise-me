"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/editor/stepper";
import { OccasionPicker } from "@/components/editor/occasion-picker";
import { MessageEditor } from "@/components/editor/message-editor";
import { PhotoUpload } from "@/components/editor/photo-upload";
import { MusicPicker } from "@/components/editor/music-picker";
import { ThemeSelector } from "@/components/editor/theme-selector";
import { SaveSettings } from "@/components/editor/save-settings";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Eye } from "lucide-react";
import { PreviewPanel } from "@/components/editor/preview-panel";

export interface EditorData {
  id?: string;
  occasion: string;
  title: string;
  message: string;
  senderName: string;
  photos: { url: string; caption: string; order: number }[];
  youtubeUrl: string;
  youtubeId: string;
  youtubeStartAt: number;
  youtubeEndAt: number | null;
  theme: string;
  password: string;
  expiresAt: string;
  status: "draft" | "published";
  videoUrl?: string;
  videoStyle?: string;
  voiceUrl?: string;
  voiceStyle?: string;
  secretMessage?: string;
  secretUnlockAt?: string;
}

const initialData: EditorData = {
  occasion: "",
  title: "",
  message: "",
  senderName: "",
  photos: [],
  youtubeUrl: "",
  youtubeId: "",
  youtubeStartAt: 0,
  youtubeEndAt: null,
  theme: "rose",
  password: "",
  expiresAt: "",
  status: "draft",
};

function EditorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("id");

  const [step, setStep] = useState(1);
  const [data, setData] = useState<EditorData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load existing page
  useEffect(() => {
    if (pageId) {
      fetch(`/api/pages/${pageId}`)
        .then(r => r.json())
        .then(page => {
          setData({
            id: page.id,
            occasion: page.occasion,
            title: page.title,
            message: page.message,
            senderName: page.senderName,
            photos: page.photos || [],
            youtubeUrl: page.youtubeUrl || "",
            youtubeId: page.youtubeId || "",
            youtubeStartAt: page.youtubeStartAt ?? 0,
            youtubeEndAt: page.youtubeEndAt ?? null,
            theme: page.theme,
            password: "",
            expiresAt: page.expiresAt ? new Date(page.expiresAt).toISOString().split("T")[0] : "",
            status: page.status as "draft" | "published",
          });
        });
    }
  }, [pageId]);

  // Auto-save
  const autoSave = useCallback(async () => {
    if (!data.title && !data.message) return;
    setIsSaving(true);
    try {
      const isEditing = Boolean(data.id);
      const res = await fetch(isEditing ? `/api/pages/${data.id}` : "/api/pages", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "draft" }),
      });
      const result = await res.json();
      if (res.ok && !isEditing && result.id) {
        setData(prev => ({ ...prev, id: result.id }));
      }
      setLastSaved(new Date());
    } catch (e) {
      console.error("Auto-save failed", e);
    } finally {
      setIsSaving(false);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(autoSave, 30000);
    return () => clearInterval(timer);
  }, [autoSave]);

  const updateData = (partial: Partial<EditorData>) => {
    setData(prev => ({ ...prev, ...partial }));
  };

  const handleSave = async (publish = false) => {
    setIsLoading(true);
    try {
      const isEditing = Boolean(data.id);
      const res = await fetch(isEditing ? `/api/pages/${data.id}` : "/api/pages", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: publish ? "published" : "draft" }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || result.error || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");

      toast({ 
        title: publish ? "เผยแพร่สำเร็จ! 🎉" : "บันทึกร่างสำเร็จ", 
        description: publish ? `ลิงก์: ${window.location.origin}/s/${result.slug}` : undefined 
      });

      if (publish) router.push(`/s/${result.slug}`);
      else router.push("/dashboard");
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { label: "โอกาส", component: <OccasionPicker data={data} onChange={updateData} /> },
    { label: "ข้อความ", component: <MessageEditor data={data} onChange={updateData} /> },
    { label: "รูปภาพ", component: <PhotoUpload data={data} onChange={updateData} /> },
    { label: "เพลง", component: <MusicPicker data={data} onChange={updateData} /> },
    { label: "ธีม", component: <ThemeSelector data={data} onChange={updateData} /> },
    { label: "บันทึก", component: <SaveSettings data={data} onChange={updateData} lastSaved={lastSaved} isSaving={isSaving} /> },
  ];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowPreview(true)}
          className="border-rose-200 text-rose-600 hover:bg-rose-50 gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>
      <Stepper currentStep={step} totalSteps={6} onChange={setStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 border border-rose-100 shadow-sm min-h-[400px]"
        >
          {steps[step - 1].component}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          ← ย้อนกลับ
        </Button>

        {step < 6 ? (
          <Button
            onClick={() => setStep(s => Math.min(6, s + 1))}
            className="bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md hover:shadow-lg"
          >
            ถัดไป →
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="border-rose-200"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              บันทึกร่าง
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg hover:shadow-xl"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              เผยแพร่เลย! 🚀
            </Button>
          </div>
        )}
      </div>
      {showPreview && (
        <PreviewPanel data={data} onClose={() => setShowPreview(false)} />
      )}
    </main>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  );
}
