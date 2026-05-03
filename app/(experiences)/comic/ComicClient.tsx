"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Home, ZoomIn, ZoomOut } from "lucide-react";

export type Chapter = {
  num: number;
  title: string;
  cover: string;
  pages: string[];
};

type View = "chapters" | "reader";

export default function ComicClient({ chapters }: { chapters: Chapter[] }) {
  const [view, setView] = useState<View>("chapters");
  const [chapterIdx, setChapterIdx] = useState(0);
  const [page, setPage] = useState(0);

  const chapter = chapters[chapterIdx];
  const totalPages = chapter.pages.length;

  const openChapter = (idx: number) => {
    setChapterIdx(idx);
    setPage(0);
    setView("reader");
  };

  const goNext = useCallback(
    () => setPage((p) => Math.min(p + 1, totalPages + 1)),
    [totalPages]
  );
  const goPrev = useCallback(() => setPage((p) => Math.max(p - 1, 0)), []);

  useEffect(() => {
    if (view !== "reader") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
      if (e.key === "Escape") setView("chapters");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, goNext, goPrev]);

  if (view === "chapters") {
    return <ChapterSelect chapters={chapters} onOpen={openChapter} />;
  }

  const src = page === 0 ? chapter.cover : chapter.pages[page - 1];
  const isCover = page === 0;
  const isLast = page > totalPages;

  return (
    <Reader
      src={src}
      page={page}
      total={totalPages}
      isCover={isCover}
      isLast={isLast}
      chapterTitle={chapter.title}
      onNext={goNext}
      onPrev={goPrev}
      onBack={() => setView("chapters")}
    />
  );
}

/* ──────────────────────────────────────────────
   CHAPTER SELECT
────────────────────────────────────────────── */
function ChapterSelect({
  chapters,
  onOpen,
}: {
  chapters: Chapter[];
  onOpen: (idx: number) => void;
}) {
  return (
    <div className="relative min-h-screen bg-[#050306] text-white px-4 py-16">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@400;500;600&family=Syncopate:wght@400;700&display=swap');
        .italiana { font-family: 'Italiana', serif; }
        .sync { font-family: 'Syncopate', sans-serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80vw 60vh at 50% 0%, rgba(134,25,143,0.14) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 manrope text-xs text-white/40 hover:text-pink-300/80 transition-colors mb-12"
        >
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>

        <div className="mb-10">
          <p className="sync text-[8px] tracking-[0.5em] text-pink-400/70 uppercase mb-3">
            Princess Azraiel
          </p>
          <h1 className="italiana text-5xl md:text-6xl text-white leading-none mb-3">
            The <em className="italic text-pink-300">Comic.</em>
          </h1>
          <p className="manrope text-sm text-white/45 leading-relaxed">
            Click a chapter to read. Use arrow keys or click the page edges to navigate.
            Scroll or pinch to zoom in.
          </p>
        </div>

        <div className="space-y-4">
          {chapters.map((ch, idx) => (
            <button
              key={ch.num}
              onClick={() => onOpen(idx)}
              className="group w-full flex items-center gap-5 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-pink-500/[0.07] hover:border-pink-500/25 transition-all duration-300 text-left"
            >
              <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/[0.1]">
                <Image
                  src={ch.cover}
                  alt={`${ch.title} cover`}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="sync text-[7px] tracking-[0.35em] text-pink-400/60 uppercase mb-1.5">
                  {ch.title}
                </p>
                <p className="italiana text-2xl text-white group-hover:text-pink-100 transition-colors leading-none mb-2">
                  Princess Azraiel
                </p>
                <p className="manrope text-xs text-white/35">{ch.pages.length} pages</p>
              </div>
              <div className="flex-shrink-0 text-white/25 group-hover:text-pink-400/70 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   READER
────────────────────────────────────────────── */
function Reader({
  src,
  page,
  total,
  isCover,
  isLast,
  chapterTitle,
  onNext,
  onPrev,
  onBack,
}: {
  src: string;
  page: number;
  total: number;
  isCover: boolean;
  isLast: boolean;
  chapterTitle: string;
  onNext: () => void;
  onPrev: () => void;
  onBack: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [src]);

  const clampPan = useCallback((x: number, y: number, z: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const maxX = (el.clientWidth * (z - 1)) / 2;
    const maxY = (el.clientHeight * (z - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const changeZoom = useCallback(
    (next: number) => {
      const z = Math.max(1, Math.min(4, next));
      setZoom(z);
      if (z <= 1) setPan({ x: 0, y: 0 });
      else setPan((p) => clampPan(p.x, p.y, z));
    },
    [clampPan]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.12 : 0.9;
      setZoom((z) => {
        const next = Math.max(1, Math.min(4, z * factor));
        if (next <= 1) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const dragging = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragging.current = true;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const nx = dragOrigin.current.px + (e.clientX - dragOrigin.current.mx);
    const ny = dragOrigin.current.py + (e.clientY - dragOrigin.current.my);
    setPan(clampPan(nx, ny, zoom));
  };
  const onMouseUp = () => { dragging.current = false; };

  const touchStartX = useRef<number | null>(null);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);
  const touchDragOrigin = useRef({ tx: 0, ty: 0, px: 0, py: 0 });

  const pinchDist = (e: React.TouchEvent) =>
    Math.hypot(
      e.touches[1].clientX - e.touches[0].clientX,
      e.touches[1].clientY - e.touches[0].clientY
    );

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = pinchDist(e);
      pinchStartZoom.current = zoom;
      touchStartX.current = null;
    } else {
      touchStartX.current = e.touches[0].clientX;
      touchDragOrigin.current = {
        tx: e.touches[0].clientX,
        ty: e.touches[0].clientY,
        px: pan.x,
        py: pan.y,
      };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      e.preventDefault();
      const next = Math.max(
        1,
        Math.min(4, pinchStartZoom.current * (pinchDist(e) / pinchStartDist.current))
      );
      setZoom(next);
      if (next <= 1) setPan({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && zoom > 1) {
      const nx = touchDragOrigin.current.px + (e.touches[0].clientX - touchDragOrigin.current.tx);
      const ny = touchDragOrigin.current.py + (e.touches[0].clientY - touchDragOrigin.current.ty);
      setPan(clampPan(nx, ny, zoom));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (pinchStartDist.current !== null) {
      pinchStartDist.current = null;
      return;
    }
    if (touchStartX.current === null || zoom > 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? onNext() : onPrev();
    touchStartX.current = null;
  };

  const onImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom > 1 || dragging.current) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    (e.clientX - left) / width < 0.5 ? onPrev() : onNext();
  };

  const onDoubleClick = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const label = isCover ? "Cover" : `${page} / ${total}`;
  const isZoomed = zoom > 1.01;

  return (
    <div className="flex flex-col h-screen bg-[#050306] text-white select-none">
      <style jsx global>{`
        .sync { font-family: 'Syncopate', sans-serif; }
        .italiana { font-family: 'Italiana', serif; }
        .manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#050306]/95 backdrop-blur-sm z-20 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 manrope text-xs text-white/40 hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {chapterTitle}
        </button>

        <span className="sync text-[8px] tracking-[0.3em] text-white/35 uppercase">
          {label}
          {isZoomed && (
            <span className="ml-2 text-pink-400/70">{Math.round(zoom * 100)}%</span>
          )}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => changeZoom(zoom * 1.3)}
            disabled={zoom >= 4}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/35 hover:text-pink-300 hover:border-pink-500/25 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => changeZoom(zoom <= 1.05 ? 1 : zoom * 0.77)}
            disabled={!isZoomed}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/35 hover:text-pink-300 hover:border-pink-500/25 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-white/[0.08] mx-0.5" />
          <button
            onClick={onPrev}
            disabled={page === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/35 hover:text-pink-300 hover:border-pink-500/25 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNext}
            disabled={isLast}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/35 hover:text-pink-300 hover:border-pink-500/25 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isLast ? (
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden"
          style={{ cursor: isZoomed ? (dragging.current ? "grabbing" : "grab") : "pointer" }}
          onClick={onImageClick}
          onDoubleClick={onDoubleClick}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center center",
              transition: dragging.current ? "none" : "transform 0.1s ease-out",
              willChange: "transform",
            }}
          >
            <Image
              src={src}
              alt={isCover ? "Chapter cover" : `Page ${page}`}
              fill
              style={{ objectFit: "contain" }}
              priority
              draggable={false}
            />
          </div>

          {!isZoomed && (
            <>
              <div className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-white/50" />
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </div>
              </div>
            </>
          )}

          {isZoomed && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="manrope text-[10px] text-white/30 bg-black/40 px-3 py-1 rounded-full">
                double-click to reset
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="sync text-[8px] tracking-[0.5em] text-pink-400/70 uppercase mb-4">
            End of {chapterTitle}
          </p>
          <h2 className="italiana text-4xl text-white mb-3 leading-none">
            To be <em className="italic text-pink-300">continued.</em>
          </h2>
          <p className="manrope text-sm text-white/45 mb-10">More chapters coming. Stay close.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] manrope text-sm text-white/60 hover:text-white hover:border-pink-500/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Last page
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500/15 border border-pink-500/35 manrope text-sm text-pink-200 hover:bg-pink-500/25 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Back to chapters
            </button>
          </div>
        </div>
      )}

      {!isCover && !isLast && (
        <div className="h-[2px] bg-white/[0.05] flex-shrink-0">
          <div
            className="h-full bg-pink-500/60 transition-all duration-300"
            style={{ width: `${(page / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
