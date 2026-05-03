export function ConsentGate({ accepted }: { accepted: boolean }) {
  if (accepted) return null;

  return (
    <div className="
      fixed inset-0 bg-black/90 z-50
      flex items-center justify-center
    ">
      <p className="text-white/60 text-center max-w-md">
        This contract is consensual and binding.
        You may leave at any time, but only if you let Princess Azraiel know the reason why.
      </p>
    </div>
  );
}
