import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header /> {/* Header stays consistent across all pages */}
          {children}
        </AuthProvider>
        <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-400 text-sm">
          © 2026 ImaniFund Initiative. Built for Collective Impact.
        </footer>
      </body>
    </html>
  );
}

// import './globals.css';
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-slate-50 text-slate-900`}>
//          <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-white shadow-sm border-b border-slate-100">
//     <div className="text-2xl font-bold text-sky-600 flex items-center gap-2 tracking-tight">
//       <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white text-sm">i</div>
//       ImaniFund
//     </div>
//     <div className="hidden md:flex gap-8 font-medium text-slate-600">
//       <a href="#" className="hover:text-sky-600 transition">Explore Campaigns</a>
//       <a href="#" className="hover:text-sky-600 transition">How it Works</a>
//       <a href="#" className="hover:text-sky-600 transition">Organisations</a>
//     </div>
//     <div className="flex gap-4">
//       <button className="px-5 py-2 text-sky-600 font-semibold">Login</button>
//       <button className="px-6 py-2 bg-sky-600 text-white rounded-full font-semibold hover:bg-sky-700 transition shadow-md shadow-sky-100">Register Now</button>
//     </div>
//   </nav>
        
//         <main>{children}</main>

//         <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-400 text-sm">
//           © 2026 ImaniFund Initiative. Built for Collective Impact.
//         </footer>
//       </body>
//     </html>
//   );
// }