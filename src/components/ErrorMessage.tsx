type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 mt-4 px-4 py-3 border border-red-200 rounded-lg text-red-700 text-sm">
      {message}
    </div>
  );
}
