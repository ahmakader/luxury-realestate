import { property } from "@/config/property";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="font-serif text-lg font-light tracking-[0.2em] text-bone">
          {property.propertyName}
        </p>
        <p className="text-[10px] uppercase tracking-luxe text-bone-dim">
          {property.city} · {property.floor} · A private residence
        </p>
        <p className="mt-4 text-[10px] text-bone-dim/60">
          All renderings are artist impressions. © {new Date().getFullYear()}{" "}
          {property.propertyName}.
        </p>
      </div>
    </footer>
  );
}
