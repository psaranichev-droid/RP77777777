import { ExternalLink } from 'lucide-react';

export const Marketplaces: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold font-rubik tracking-normal text-slate-900 mb-6">
            Покупайте прямо сейчас на маркетплейсах
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Понимаем, как важна для вас надежность, стабильность и универсальность материалов, чтобы успешно реализовывать ваши проекты.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Wildberries Card */}
          <a 
            href="https://www.wildberries.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group p-12 rounded-[2.5rem] bg-white border border-slate-100 hover:border-[#cb11ab]/20 hover:shadow-2xl hover:shadow-[#cb11ab]/5 transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
          >
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-10 transition-transform duration-500 group-hover:scale-110">
                <img 
                  src="https://logo-teka.com/wp-content/uploads/2025/06/wildberries-horizontal-logo.svg" 
                  alt="Wildberries" 
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl font-bold text-[#cb11ab]">Wildberries</span>';
                  }}
                />
              </div>
              <div className="inline-flex items-center gap-2 bg-[#cb11ab] text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 group-hover:bg-[#a00d87] group-hover:shadow-xl group-hover:shadow-[#cb11ab]/20">
                Перейти в магазин <ExternalLink size={18} />
              </div>
            </div>
            {/* Ambient Brand Light */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#cb11ab]/0 via-transparent to-[#cb11ab]/0 group-hover:from-[#cb11ab]/[0.02] group-hover:to-[#cb11ab]/[0.05] transition-all duration-700" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#cb11ab]/5 rounded-full blur-3xl group-hover:bg-[#cb11ab]/10 transition-all duration-700" />
          </a>

          {/* Ozon Card */}
          <a 
            href="https://www.ozon.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative group p-12 rounded-[2.5rem] bg-white border border-slate-100 hover:border-[#005bff]/20 hover:shadow-2xl hover:shadow-[#005bff]/5 transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
          >
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-10 transition-transform duration-500 group-hover:scale-110">
                <img 
                  src="https://logo-teka.com/wp-content/uploads/2025/06/ozon-logo.svg" 
                  alt="Ozon" 
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl font-bold text-[#005bff]">Ozon</span>';
                  }}
                />
              </div>
              <div className="inline-flex items-center gap-2 bg-[#005bff] text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 group-hover:bg-[#0046c7] group-hover:shadow-xl group-hover:shadow-[#005bff]/20">
                Перейти в магазин <ExternalLink size={18} />
              </div>
            </div>
            {/* Ambient Brand Light */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#005bff]/0 via-transparent to-[#005bff]/0 group-hover:from-[#005bff]/[0.02] group-hover:to-[#005bff]/[0.05] transition-all duration-700" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#005bff]/5 rounded-full blur-3xl group-hover:bg-[#005bff]/10 transition-all duration-700" />
          </a>
        </div>
      </div>
    </section>
  );
};
