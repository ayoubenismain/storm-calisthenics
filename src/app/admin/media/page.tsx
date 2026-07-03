"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Copy, Check, Image as ImgIcon, Film, Music, Box } from "lucide-react";

interface Asset { _id: string; originalName: string; url: string; type: string; size: number; mimeType: string; createdAt: string; }

const TYPE_ICONS: Record<string, any> = { image: ImgIcon, video: Film, sound: Music, model: Box };

export default function AdminMedia() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = (type?: string) => {
    const q = type ? `?type=${type}` : "";
    fetch(`/api/admin/media${q}`).then((r) => r.json()).then((d) => { setAssets(d.assets || []); setLoading(false); });
  };

  useEffect(() => { load(filter || undefined); }, [filter]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch("/api/admin/media", { method: "POST", body: fd });
    }
    await load(filter || undefined);
    setUploading(false);
  };

  const copyUrl = (asset: Asset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Media Library</h1>
          <p className="text-white/40 text-sm">{assets.length} assets</p>
        </div>
        <button
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
        <input ref={fileInput} type="file" multiple className="hidden"
          accept="image/*,video/*,audio/*,.glb,.gltf"
          onChange={(e) => e.target.files && handleUpload(e.target.files)} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["", "image", "video", "model", "sound"].map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-1.5 rounded text-sm border transition-all capitalize ${filter === t ? "bg-white text-black border-white" : "bg-white/5 text-white/50 border-white/10 hover:border-white/30"}`}>
            {t || "All"}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-white/30 text-sm p-8 text-center">Loading...</div>
      ) : assets.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-white/10 rounded-lg">
          <Upload className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No assets uploaded yet</p>
          <button onClick={() => fileInput.current?.click()} className="mt-3 text-white/50 hover:text-white text-sm underline transition-colors">Upload your first asset</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => {
            const Icon = TYPE_ICONS[asset.type] || ImgIcon;
            return (
              <div key={asset._id} className="group bg-white/3 border border-white/5 rounded-lg overflow-hidden hover:border-white/20 transition-all">
                {/* Preview */}
                <div className="aspect-square bg-white/5 relative">
                  {asset.type === "image" ? (
                    <img src={asset.url} alt={asset.originalName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-white text-xs font-medium truncate" title={asset.originalName}>{asset.originalName}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{formatSize(asset.size)}</p>
                  <div className="flex gap-1 mt-2">
                    <button onClick={() => copyUrl(asset)} title="Copy URL" className="flex-1 flex items-center justify-center py-1.5 rounded text-[10px] bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all gap-1">
                      {copiedId === asset._id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedId === asset._id ? "Copied" : "Copy URL"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
