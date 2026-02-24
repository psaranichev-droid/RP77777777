import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook } from 'lucide-react';
import { cn } from '../utils/cn';

export const Footer = () => {
  const { pathname, search } = useLocation();
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    { title: 'Оплата', path: '/payment' },
    { title: 'Возврат', path: '/returns' },
    { title: 'Доставка', path: '/shipping' },
    { title: 'Реквизиты', path: '/details' },
  ];

  const mainMenu = [
    { title: 'Оптовые цены', path: '/wholesale' },
    { title: 'Шоурум', path: '/showroom' },
    { title: 'Дизайнерская бумага', path: '/catalog' },
    { title: 'Индивидуальная резка', path: '/cutting' },
  ];

  const productCategories = [
    { title: 'Офсетная бумага', path: '/catalog?cat=offset' },
    { title: 'Мелованная бумага', path: '/catalog?cat=coated' },
    { title: 'Дизайнерская бумага', path: '/catalog?cat=designer' },
    { title: 'Картон', path: '/catalog?cat=cardboard' },
    { title: 'Заготовки', path: '/catalog?cat=blanks' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 font-inter">
      {/* Newsletter Section - Organic & Strict */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 border-b border-slate-900">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-rubik mb-3">
              Подпишитесь на новостную рассылку
            </h2>
            <p className="text-slate-400">
              Будьте в курсе новых поступлений, специальных предложений и акций.
            </p>
          </div>
          
          <form className="w-full max-w-md">
            <div className="relative flex items-center p-1.5 bg-slate-900 rounded-xl border border-slate-800 focus-within:border-indigo-500/50 transition-all">
              <input
                type="email"
                placeholder="Ваш email"
                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-4 py-3"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-lg transition-colors group"
                aria-label="Подписаться"
              >
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col space-y-8">
            <Link to="/" className="flex flex-col group">
              <span className="text-3xl font-bold text-white font-rubik tracking-tight leading-none group-hover:text-indigo-400 transition-colors">ONLOOK</span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-indigo-500 font-bold mt-2 ml-1">дизайн-бутик</span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Профессиональный поставщик исключительных материалов для типографий, дизайнеров и творческих людей. Искусство бумаги в каждой детали.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Меню</h3>
              <ul className="space-y-3">
                {mainMenu.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => cn(
                        "text-sm transition-colors hover:text-white inline-flex items-center",
                        isActive ? "text-indigo-400 font-medium" : "text-slate-400"
                      )}
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Продукция</h3>
              <ul className="space-y-3">
                {productCategories.map((link) => {
                  const isLinkActive = pathname + search === link.path;
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={cn(
                          "text-sm transition-colors hover:text-white",
                          isLinkActive ? "text-indigo-400 font-medium" : "text-slate-400"
                        )}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Сервис</h3>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) => cn(
                        "text-sm transition-colors hover:text-white",
                        isActive ? "text-indigo-400 font-medium" : "text-slate-400"
                      )}
                    >
                      {link.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacts Column */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Контакты</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="mt-1 p-2.5 rounded-lg bg-slate-900 text-indigo-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Телефон</p>
                  <a href="tel:+79101066003" className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                    +7 (910) 106-60-03
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="mt-1 p-2.5 rounded-lg bg-slate-900 text-indigo-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:info@onlook.ru" className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                    info@onlook.ru
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg bg-slate-900 text-indigo-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Офис</p>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed">
                    г. Нижний Новгород,<br />ул. Баумана, 48, корпус 1
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 rounded-lg bg-slate-900 text-indigo-500">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Режим работы</p>
                  <p className="text-sm font-medium text-slate-300">
                    Пн-Пт: 09:00 — 18:00<br />
                    Сб-Вс: Выходной
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-medium italic">
            &copy; {currentYear} ONLOOK. Дизайн-бутик бумаги и картона.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[11px] text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Конфиденциальность</a>
            <a href="#" className="text-[11px] text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
