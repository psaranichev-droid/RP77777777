import Hero from '../components/Hero';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Layers, 
  Palette, 
  Brush, 
  Users, 
  UserCheck, 
  Sparkles, 
  MapPin, 
  Clock, 
  ParkingCircle, 
  Scissors, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const ShowroomPage = () => {
  const assortment = [
    {
      title: "Офсетная бумага",
      desc: "Универсальная бумага для полиграфии и офиса",
      icon: <FileText className="w-8 h-8 text-indigo-600" />
    },
    {
      title: "Мелованная бумага",
      desc: "Глянцевая и матовая для премиум-печати",
      icon: <Layers className="w-8 h-8 text-indigo-600" />
    },
    {
      title: "Мелованный картон",
      desc: "Плотный картон для упаковки и полиграфии",
      icon: <Layers className="w-8 h-8 text-indigo-600" />
    },
    {
      title: "Дизайнерская бумага",
      desc: "Уникальные текстуры и цвета для творчества",
      icon: <Palette className="w-8 h-8 text-indigo-600" />
    }
  ];

  const clients = [
    {
      role: "Полиграфисты",
      text: "У нас есть офсетная, мелованная и дизайнерская бумага. Если нужно, порежем сразу в нужный формат",
      icon: <UserCheck className="w-6 h-6" />
    },
    {
      role: "Дизайнеры",
      text: "Крутые проекты делаются только на дизайнерской бумаге — приходите, смотрите, вдохновляйтесь",
      icon: <Brush className="w-6 h-6" />
    },
    {
      role: "Творческие люди",
      text: "В нашем шоуруме есть в наличии бумага формата А4 и А3, которую можно приобрести поштучно, нет границ для творчества",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      role: "Клиенты типографий",
      text: "Типографии не продают бумагу — они на ней печатают, так что перед тем, как искать типографию, выберите бумагу",
      icon: <Users className="w-6 h-6" />
    }
  ];

  const facts = [
    { text: "Более 500 видов бумаги: Дизайнерская, Офсетная, Меловая", icon: <Layers className="w-5 h-5" /> },
    { text: "Оборудованное пространство для погружения в творческий процесс", icon: <Brush className="w-5 h-5" /> },
    { text: "Помощь специалиста в подборе бумаги под ваши задачи", icon: <ShieldCheck className="w-5 h-5" /> },
    { text: "Всегда найдется парковочное место для размещения машины", icon: <ParkingCircle className="w-5 h-5" /> },
    { text: "Удобное местоположение в 10 мин. от станции метро Заречная", icon: <MapPin className="w-5 h-5" /> },
    { text: "Можно отрезать небольшой фрагмент образца бумаги", icon: <Scissors className="w-5 h-5" /> }
  ];

  return (
    <div className="bg-white">
      <Hero
        title={`Шоурум бумаги и картона \n в Нижнем Новгороде`}
        description="У нас вы можете выбрать дизайнерскую бумагу по образцам и каталогам, купить офсетную и мелованную бумагу Royal Paper, ознакомиться с ассортиментом картона, получить консультацию и оформить заказ."
        videoSrc="https://assets.mixkit.co/videos/preview/mixkit-printing-machine-printing-a-newspaper-in-a-printing-press-40244-large.mp4"
        overlayColor="bg-indigo-950/80"
        buttons={[
          { label: 'Записаться на визит', href: '#visit', primary: true },
          { label: 'Смотреть на карте', href: 'https://yandex.ru/maps/-/CDuYv-Zp' }
        ]}
      />

      {/* Факты */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">Факты</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-rubik tracking-normal">Несколько интересных фактов о шоуруме</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-inter">
                Наш шоурум — это не просто склад, а полноценное творческое пространство для тех, кто ценит качество и эстетику материалов.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                {facts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 text-indigo-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-slate-700 font-medium font-inter">{fact.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-slate-100 overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1586075010620-804f479710f6?auto=format&fit=crop&q=80&w=1000" 
                  alt="Showroom" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-900 font-rubik tracking-normal">Режим работы</span>
                </div>
                <p className="text-sm text-slate-600 font-inter">Пн-Пт: 9:00 — 18:00</p>
                <p className="text-sm text-slate-600 font-inter">Сб-Вс: выходной</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Наши клиенты */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative border-y border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-400 tracking-wider uppercase mb-3">Наши клиенты</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-rubik tracking-normal">Кто в основном посещает наш шоурум</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-inter">Мы работаем с самыми разными клиентами</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clients.map((client, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  {client.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 font-rubik tracking-normal">{client.role}</h4>
                  <p className="text-slate-400 leading-relaxed font-inter">{client.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ассортимент */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-3">Ассортимент</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-rubik tracking-normal">Категории товаров</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-inter">Которые у нас можно посмотреть или купить в шоуруме</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assortment.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors"
              >
                <div className="mb-6">{item.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 font-rubik tracking-normal">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed font-inter">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShowroomPage;