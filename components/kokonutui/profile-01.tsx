import { LogOut, MoveUpRight, Settings, CreditCard, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
}

interface Profile01Props {
  name: string
  role: string
  avatar: string
  subscription?: string
  onClose?: () => void
  onLogout?: () => void
}

export default function Profile01({
  name,
  role,
  avatar,
  subscription = "Free Trial",
  onClose,
  onLogout
}: Profile01Props) {
  const router = useRouter()
  
  const menuItems: MenuItem[] = [
   {
     label: "Subscription",
     value: subscription,
     href: "",
     icon: <CreditCard className="w-4 h-4" />,
     external: false,
   },
  //  {
  //    label: "Settings",
  //    href: "/settings",
  //    icon: <Settings className="w-4 h-4" />,
  //  },
   //{
   //  label: "Terms & Policies",
   //  href: "/terms",
   //  icon: <FileText className="w-4 h-4" />,
   //  external: true,
   //},
  ]

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })

      if (response.ok) {
        localStorage.removeItem("isAuthenticated")
        localStorage.removeItem("user")
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleItemClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F12] shadow-lg">
        <div className="relative px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <Image
                src={avatar}
                alt={name}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-white dark:ring-zinc-900 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{name}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{role}</p>
            </div>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-4" />
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleItemClick}
                className="flex items-center justify-between p-2 
                  hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                  rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.value && <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">{item.value}</span>}
                  {item.external && <MoveUpRight className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
                </div>
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-2 
                hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                rounded-lg transition-colors duration-200 text-red-600 dark:text-red-500"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
