"use client";

import Spinner from "./Spinner";
import Link from "next/link";
import useSession from "@/lib/useSession";
import useStore from "@/store";
import { apiLogoutUser } from "@/lib/api-requests";
import { useRouter } from "next/navigation";

const Header = () => {
  const store = useStore();
  const user = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    store.setRequestLoading(true);
    try {
      await apiLogoutUser();
    } catch (error) {
    } finally {
      store.reset();
      router.push("/login");
    }
  };

  return (
    <>
      <main className="fixed w-full z-50">
      <header className="flex w-full bg-primary-bg py-4 px-2 bg-white sticky top-0 z-50 drop-shadow-lg">
        <nav className="h-full flex justify-between container items-center">
          <div>
            <Link href="/" className="text-ct-dark-600 text-2xl font-semibold">
              Auction App
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            {!user && (
              <>
                <li>
                  <Link href="/register" className="text-ct-dark-600">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-ct-dark-600">
                    Login
                  </Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <Link href="/profile" className="text-ct-dark-600">
                    Profile
                  </Link>
                </li>
                <li className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <div className="pt-4 pl-2 bg-ct-blue-600 fixed">
        {store.requestLoading && <Spinner color="text-ct-yellow-600" />}
      </div>
      </main>
    </>
  );
};

export default Header;
