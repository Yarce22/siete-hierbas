export function Feedback({ ok, message }: { ok: boolean; message: string }) {
  return (
    <p className={`mt-2 text-sm ${ok ? "text-green-600" : "text-red-600"}`}>
      {message}
    </p>
  );
}
