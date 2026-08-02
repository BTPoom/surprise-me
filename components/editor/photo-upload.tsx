"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorData } from "@/app/(dashboard)/editor/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function PhotoUpload({ data, onChange }: { data: EditorData; onChange: (d: Partial<EditorData>) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "ไฟล์ใหญ่เกินไป", description: "จำกัดขนาดไฟล์ไม่เกิน 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    // In production: upload to R2/S3 and get URL
    // Mock upload delay
    await new Promise(r => setTimeout(r, 1000));
    const response = await fetch(`/api/upload?filename=${file.name}`, { method: "POST", body: file }); const blob = await response.json(); const mockUrl = blob.url;

    onChange({
      photos: [...data.photos, { url: mockUrl, caption: "", order: data.photos.length }],
    });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    onChange({
      photos: data.photos.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })),
    });
  };

  const updateCaption = (index: number, caption: string) => {
    const newPhotos = [...data.photos];
    newPhotos[index] = { ...newPhotos[index], caption };
    onChange({ photos: newPhotos });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">เพิ่มรูปภาพ 📸</h2>
      <p className="text-slate-500 mb-6">อัปโหลดรูปภาพสวยๆ ในรูปแบบ Polaroid (สูงสุด 10 รูป)</p>

      <div className="flex flex-wrap gap-6 justify-center">
        <AnimatePresence>
          {data.photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="polaroid rounded-lg transform"
              style={{ transform: `rotate(${[-3, 2, -2, 3, -1, 1][i % 6]}deg)` }}
            >
              <div className="relative">
                <img src={photo.url} alt={`Photo ${i + 1}`} className="w-40 h-40 object-cover rounded bg-gradient-to-br from-rose-100 to-pink-200" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <Input
                placeholder="คำบรรยาย..."
                value={photo.caption}
                onChange={e => updateCaption(i, e.target.value)}
                className="mt-3 text-center text-sm border-0 border-b border-slate-200 rounded-none focus:ring-0 px-1 font-handwriting text-lg"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {data.photos.length < 10 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border-2 border-dashed border-rose-200 rounded-lg flex flex-col items-center justify-center gap-2 w-48 h-56 hover:bg-rose-50 transition-colors"
          >
            {uploading ? (
              <div className="w-8 h-8 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-8 h-8 text-rose-300" />
                <span className="text-sm text-rose-400">เพิ่มรูปภาพ</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
