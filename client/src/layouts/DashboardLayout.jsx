// import { useState } from "react";
// import { Outlet, NavLink, useLocation } from "react-router-dom";
// import { AnimatePresence, motion } from "framer-motion";
// import Sidebar from "../components/Sidebar.jsx";
// import TopNavbar from "../components/TopNavbar.jsx";
// import { IoClose, IoGridOutline, IoListOutline, IoPersonOutline } from "react-icons/io5";

// const mobileLinks = [
//   { to: "/dashboard", label: "Dashboard", icon: IoGridOutline },
//   { to: "/tasks", label: "Tasks", icon: IoListOutline },
//   { to: "/profile", label: "Profile", icon: IoPersonOutline },
// ];

// export default function DashboardLayout() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const location = useLocation();

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40">
//       <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

//       <AnimatePresence>
//         {mobileOpen && (
//           <>
//             <motion.button
//               type="button"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
//               aria-label="Close menu"
//               onClick={() => setMobileOpen(false)}
//             />
//             <motion.aside
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", stiffness: 320, damping: 34 }}
//               className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 md:hidden"
//             >
//               <div className="mb-6 flex items-center justify-between">
//                 <p className="font-display text-lg font-bold text-slate-900 dark:text-white">Menu</p>
//                 <button
//                   type="button"
//                   className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   <IoClose className="h-6 w-6" />
//                 </button>
//               </div>
//               <nav className="flex flex-col gap-1">
//                 {mobileLinks.map(({ to, label, icon: Icon }) => (
//                   <NavLink
//                     key={to}
//                     to={to}
//                     onClick={() => setMobileOpen(false)}
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold ${
//                         isActive
//                           ? "bg-indigo-600/10 text-indigo-700 dark:text-indigo-300"
//                           : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
//                       }`
//                     }
//                   >
//                     <Icon className="h-5 w-5" />
//                     {label}
//                   </NavLink>
//                 ))}
//               </nav>
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       <div className="flex min-w-0 flex-1 flex-col">
//         <TopNavbar onOpenMobile={() => setMobileOpen(true)} />
//         <main className="flex-1 p-4 md:p-6">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={location.pathname}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2 }}
//             >
//               <Outlet />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import TopNavbar from "../components/TopNavbar.jsx";
import { IoClose, IoGridOutline, IoListOutline, IoPersonOutline } from "react-icons/io5";

const mobileLinks = [
  { to: "/dashboard", label: "Dashboard", icon: IoGridOutline },
  { to: "/tasks", label: "Tasks", icon: IoListOutline },
  { to: "/profile", label: "Profile", icon: IoPersonOutline },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40">
      
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      {/* Mobile Sidebar (NO ANIMATION) */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/60 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
            
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Menu
              </p>

              <button
                type="button"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileOpen(false)}
              >
                <IoClose className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {mobileLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold ${
                      isActive
                        ? "bg-indigo-600/10 text-indigo-700 dark:text-indigo-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </>
      )}

      {/* Main Layout */}
      <div className="flex min-w-0 flex-1 flex-col">
        
        <TopNavbar onOpenMobile={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 md:p-6">
          
          {/* Page Content (NO ANIMATION) */}
          <div key={location.pathname}>
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
}
