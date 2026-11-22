export default function Toast({ msg, visible }: { msg: string; visible: boolean; }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg text-sm font-semibold transition-all"
      style={{ background: "rgba(255,46,99,0.95)", color: "#fff", opacity: visible ? 1 : 0, transform: `translate(-50%, ${visible ? "0" : "-20px"})`, pointerEvents: "none" }}>
      {msg}
    </div>
  );
}