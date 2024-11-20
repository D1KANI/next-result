import { useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const session = useSession();
  const user = session.data?.user;

  console.log(user);

  return (
    <header className="flex justify-between items-center p-4 bg-white">
      <Link href="/" className="flex items-center">
        <span className="mr-2">LOGO</span>
        <span className="text-xl font-bold">Result School</span>
      </Link>
      <div className="flex items-center">
        <span className="mr-4">{user?.name}</span>
        <Link
          href="/events/create"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Создать событие
        </Link>
      </div>
    </header>
  );
}
