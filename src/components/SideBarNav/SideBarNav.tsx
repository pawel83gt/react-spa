
import { useLocation, Link } from "react-router";

interface MenuItem {
  href: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { href: "/", label: "Главная" },
  { href: "/products", label: "Продукция" },
  { href: "/create-product", label: "Создать" },
];

const SideBarNav = () => {

  const { pathname } = useLocation();

  return (
    <div className="px-8 py-10 bg-gray-100">
      <nav>
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => {
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`block px-3 py-2 rounded-md transition-colors ${pathname === item.href
                      ? "bg-blue-200 text-orange-900"
                      : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  )
}

export default SideBarNav