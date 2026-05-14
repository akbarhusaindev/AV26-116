// // import { motion, AnimatePresence } from "framer-motion";
// // import { NavLink } from "react-router-dom";
// // import {
// //   IoChevronBack,
// //   IoChevronForward,
// //   IoGridOutline,
// //   IoListOutline,
// //   IoPersonOutline,
// // } from "react-icons/io5";
// // import { HiOutlineSparkles } from "react-icons/hi2";

// // const links = [
// //   { to: "/dashboard", label: "Dashboard", icon: IoGridOutline },
// //   { to: "/tasks", label: "Tasks", icon: IoListOutline },
// //   { to: "/profile", label: "Profile", icon: IoPersonOutline },
// // ];

// // export default function Sidebar({ collapsed, onToggle }) {
// //   return (
// //     <motion.aside
// //       initial={false}
// //       animate={{ width: collapsed ? 80 : 260 }}
// //       transition={{ type: "spring", stiffness: 320, damping: 32 }}
// //       className="relative z-20 hidden shrink-0 flex-col border-r border-slate-200/60 bg-white/50 py-6 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40 md:flex"
// //     >
// //       <div className={`mb-8 flex items-center gap-3 px-4 ${collapsed ? "justify-center" : ""}`}>
// //         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
// //           <HiOutlineSparkles className="h-6 w-6" />
// //         </div>
// //         <AnimatePresence mode="wait">
// //           {!collapsed && (
// //             <motion.div
// //               initial={{ opacity: 0, x: -8 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -8 }}
// //               className="min-w-0"
// //             >
// //               <p className="font-display text-lg font-bold leading-tight text-slate-900 dark:text-white">
// //                 SmartTask
// //               </p>
// //               <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Pro</p>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </div>

// //       <nav className="flex flex-1 flex-col gap-1 px-2">
// //         {links.map(({ to, label, icon: Icon }) => (
// //           <NavLink
// //             key={to}
// //             to={to}
// //             className={({ isActive }) =>
// //               `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
// //                 isActive
// //                   ? "bg-gradient-to-r from-indigo-600/15 to-purple-600/10 text-indigo-700 shadow-inner ring-1 ring-indigo-500/20 dark:text-indigo-300"
// //                   : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
// //               } ${collapsed ? "justify-center" : ""}`
// //             }
// //             title={label}
// //           >
// //             <Icon className="h-5 w-5 shrink-0" />
// //             <AnimatePresence mode="wait">
// //               {!collapsed && (
// //                 <motion.span
// //                   initial={{ opacity: 0 }}
// //                   animate={{ opacity: 1 }}
// //                   exit={{ opacity: 0 }}
// //                   className="truncate"
// //                 >
// //                   {label}
// //                 </motion.span>
// //               )}
// //             </AnimatePresence>
// //           </NavLink>
// //         ))}
// //       </nav>

// //       <div className="mt-auto px-2 pt-6">
// //         <button
// //           type="button"
// //           onClick={onToggle}
// //           className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 py-2 text-sm font-medium text-slate-600 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
// //           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
// //         >
// //           {collapsed ? <IoChevronForward className="h-5 w-5" /> : <IoChevronBack className="h-5 w-5" />}
// //         </button>
// //       </div>
// //     </motion.aside>
// //   );
// // }

// // import { motion, AnimatePresence } from "framer-motion";
// // import { NavLink } from "react-router-dom";
// // import {
// //   IoChevronBack,
// //   IoChevronForward,
// //   IoGridOutline,
// //   IoListOutline,
// //   IoPersonOutline,
// // } from "react-icons/io5";
// // import { HiOutlineSparkles } from "react-icons/hi2";

// // const links = [
// //   { to: "/dashboard", label: "Dashboard", icon: IoGridOutline },
// //   { to: "/tasks", label: "Tasks", icon: IoListOutline },

// //   // 🆕 NOTES FEATURE ADDED
// //   { to: "/notes", label: "Notes", icon: HiOutlineSparkles },

// //   { to: "/profile", label: "Profile", icon: IoPersonOutline },
// // ];

// // export default function Sidebar({ collapsed, onToggle }) {
// //   return (
// //     <motion.aside
// //       initial={false}
// //       animate={{ width: collapsed ? 80 : 260 }}
// //       transition={{ type: "spring", stiffness: 320, damping: 32 }}
// //       className="relative z-20 hidden shrink-0 flex-col border-r border-slate-200/60 bg-white/50 py-6 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40 md:flex"
// //     >
// //       {/* LOGO */}
// //       <div className={`mb-8 flex items-center gap-3 px-4 ${collapsed ? "justify-center" : ""}`}>
// //         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
// //           <HiOutlineSparkles className="h-6 w-6" />
// //         </div>

// //         <AnimatePresence mode="wait">
// //           {!collapsed && (
// //             <motion.div
// //               initial={{ opacity: 0, x: -8 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -8 }}
// //               className="min-w-0"
// //             >
// //               <p className="font-display text-lg font-bold leading-tight text-slate-900 dark:text-white">
// //                 SmartTask
// //               </p>
// //               <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
// //                 Pro
// //               </p>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </div>

// //       {/* NAV LINKS */}
// //       <nav className="flex flex-1 flex-col gap-1 px-2">
// //         {links.map(({ to, label, icon: Icon }) => (
// //           <NavLink
// //             key={to}
// //             to={to}
// //             className={({ isActive }) =>
// //               `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
// //                 isActive
// //                   ? "bg-gradient-to-r from-indigo-600/15 to-purple-600/10 text-indigo-700 shadow-inner ring-1 ring-indigo-500/20 dark:text-indigo-300"
// //                   : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
// //               } ${collapsed ? "justify-center" : ""}`
// //             }
// //             title={label}
// //           >
// //             <Icon className="h-5 w-5 shrink-0" />

// //             <AnimatePresence mode="wait">
// //               {!collapsed && (
// //                 <motion.span
// //                   initial={{ opacity: 0 }}
// //                   animate={{ opacity: 1 }}
// //                   exit={{ opacity: 0 }}
// //                   className="truncate"
// //                 >
// //                   {label}
// //                 </motion.span>
// //               )}
// //             </AnimatePresence>
// //           </NavLink>
// //         ))}
// //       </nav>

// //       {/* COLLAPSE BUTTON */}
// //       <div className="mt-auto px-2 pt-6">
// //         <button
// //           type="button"
// //           onClick={onToggle}
// //           className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 py-2 text-sm font-medium text-slate-600 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
// //           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
// //         >
// //           {collapsed ? (
// //             <IoChevronForward className="h-5 w-5" />
// //           ) : (
// //             <IoChevronBack className="h-5 w-5" />
// //           )}
// //         </button>
// //       </div>
// //     </motion.aside>
// //   );
// // }

// import { motion, AnimatePresence } from "framer-motion";
// import { NavLink } from "react-router-dom";
// import {
//   IoChevronBack,
//   IoChevronForward,
//   IoGridOutline,
//   IoListOutline,
//   IoPersonOutline,
//   IoGlobeOutline,
//   IoChatbubblesOutline,
//   IoBookOutline, // 1️⃣ Adde
//   IoVideocamOutline,
//   IoDocumentTextOutline
// } from "react-icons/io5";
// import { HiOutlineSparkles } from "react-icons/hi2";

// const links = [
//   { to: "/dashboard", label: "Dashboard", icon: IoGridOutline },
//   { to: "/tasks", label: "Tasks", icon: IoListOutline },
//   { to: "/notes", label: "Notes", icon: HiOutlineSparkles },
//   { to: "/community", label: "Community", icon: IoGlobeOutline },
//   { to: "/ai-chat", label: "AI Chat", icon: IoChatbubblesOutline }, // 2️⃣ Added the link right here
// { to: "/analytics", label: "Analytics", icon: IoTrendingUpOutline },
// { to: "/interview", label: "Mock Interview", icon: IoVideocamOutline },
//   { to: "/curriculum", label: "Curriculum", icon: IoBookOutline },

//   { to: "/profile", label: "Profile", icon: IoPersonOutline },
// ];

// export default function Sidebar({ collapsed, onToggle }) {
//   return (
//     <motion.aside
//       initial={false}
//       animate={{ width: collapsed ? 80 : 260 }}
//       transition={{ type: "spring", stiffness: 320, damping: 32 }}
//       className="relative z-20 hidden shrink-0 flex-col border-r border-slate-200/60 bg-white/50 py-6 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40 md:flex"
//     >
//       {/* LOGO */}
//       <div className={`mb-8 flex items-center gap-3 px-4 ${collapsed ? "justify-center" : ""}`}>
//         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
//           <HiOutlineSparkles className="h-6 w-6" />
//         </div>

//         <AnimatePresence mode="wait">
//           {!collapsed && (
//             <motion.div
//               initial={{ opacity: 0, x: -8 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -8 }}
//               className="min-w-0"
//             >
//               <p className="font-display text-lg font-bold leading-tight text-slate-900 dark:text-white">
//                 SmartTask
//               </p>
//               <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
//                 Pro
//               </p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* NAV LINKS */}
//       <nav className="flex flex-1 flex-col gap-1 px-2">
//         {links.map(({ to, label, icon: Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
//                 isActive
//                   ? "bg-gradient-to-r from-indigo-600/15 to-purple-600/10 text-indigo-700 shadow-inner ring-1 ring-indigo-500/20 dark:text-indigo-300"
//                   : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
//               } ${collapsed ? "justify-center" : ""}`
//             }
//             title={label}
//           >
//             <Icon className="h-5 w-5 shrink-0" />

//             <AnimatePresence mode="wait">
//               {!collapsed && (
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="truncate"
//                 >
//                   {label}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </NavLink>
//         ))}
//       </nav>

//       {/* COLLAPSE BUTTON */}
//       <div className="mt-auto px-2 pt-6">
//         <button
//           type="button"
//           onClick={onToggle}
//           className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 py-2 text-sm font-medium text-slate-600 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
//           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {collapsed ? (
//             <IoChevronForward className="h-5 w-5" />
//           ) : (
//             <IoChevronBack className="h-5 w-5" />
//           )}
//         </button>
//       </div>
//     </motion.aside>
//   );
// }



import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  IoChevronBack,
  IoChevronForward,
  IoGridOutline,
  IoListOutline,
  IoPersonOutline,
  IoGlobeOutline,
  IoChatbubblesOutline,
  IoBookOutline, 
  IoVideocamOutline,
  IoDocumentTextOutline,
  IoTrendingUpOutline // ✅ Added the missing import right here!
} from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: IoGridOutline },
  { to: "/tasks", label: "Tasks", icon: IoListOutline },
  { to: "/notes", label: "Notes", icon: HiOutlineSparkles },
  { to: "/community", label: "Community", icon: IoGlobeOutline },
  { to: "/ai-chat", label: "AI Chat", icon: IoChatbubblesOutline },
  { to: "/analytics", label: "Analytics", icon: IoTrendingUpOutline },
  { to: "/interview", label: "Mock Interview", icon: IoVideocamOutline },
  { to: "/curriculum", label: "Curriculum", icon: IoBookOutline },
  { to: "/profile", label: "Profile", icon: IoPersonOutline },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="relative z-20 hidden shrink-0 flex-col border-r border-slate-200/60 bg-white/50 py-6 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40 md:flex"
    >
      {/* LOGO */}
      <div className={`mb-8 flex items-center gap-3 px-4 ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <HiOutlineSparkles className="h-6 w-6" />
        </div>

        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="min-w-0"
            >
              <p className="font-display text-lg font-bold leading-tight text-slate-900 dark:text-white">
                SmartTask
              </p>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Pro
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/15 to-purple-600/10 text-indigo-700 shadow-inner ring-1 ring-indigo-500/20 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
              } ${collapsed ? "justify-center" : ""}`
            }
            title={label}
          >
            <Icon className="h-5 w-5 shrink-0" />

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* COLLAPSE BUTTON */}
      <div className="mt-auto px-2 pt-6">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 py-2 text-sm font-medium text-slate-600 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <IoChevronForward className="h-5 w-5" />
          ) : (
            <IoChevronBack className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}