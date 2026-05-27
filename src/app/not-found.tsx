export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4" style={{ background: '#080c18' }}>
      <h1 className="text-5xl font-semibold text-gray-100">404</h1>
      <h2 className="text-2xl font-semibold mt-6 text-gray-100">Page not found</h2>
      <p className="mt-4 text-xl text-gray-500">The page you are looking for does not exist.</p>
    </div>
  );
}
