import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="bg-blue-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/website" className="text-xl font-bold">
          CLC Admin
        </Link>
        <div className="flex gap-4">
          <Link href="/website/users" className="hover:text-blue-200">
            Users
          </Link>
          <Link href="/website/cases" className="hover:text-blue-200">
            Cases
          </Link>
          <Link href="/website/settings" className="hover:text-blue-200">
            Settings
          </Link>
          <Link href="/" className="hover:text-blue-200">
            Exit Admin
          </Link>
        </div>
      </nav>
    </header>
  );
} 