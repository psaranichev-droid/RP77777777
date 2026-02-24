import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Target, Scale, Maximize2, Scissors, Layers, Zap } from 'lucide-react';
import Hero from '../components/Hero';

const CuttingPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const specs = [
    { 
      icon: Target, 
      value: '±0.5 мм', 
      label: 'Точность',
      desc: 'Высокоточная резка'
    },
    { 
      icon: Scale, 
      value: 'до 400 г/м²', 
      label: 'Плотность',
      desc: 'Бумага и картон'
    },
    { 
      icon: Maximize2, 
      value: 'A7 — SRA3', 
      label: 'Форматы',
      desc: 'Любые размеры'
    },
    { 
      icon: Scissors, 
      value: 'до 480 мм', 
      label: 'Ширина реза',
      desc: 'Максимальный размер'
    },
    { 
      icon: Layers, 
      value: 'Бумага, картон', 
      label: 'Материалы',
      desc: 'Все виды материалов'
    },
    { 
      icon: Zap, 
      value: '5000+', 
      label: 'Резов в день',
      desc: 'Высокая скорость'
    }
  ];

  return (
    <div className="bg-white">
      <Hero
        title={`Оказываем услугу по резке
бумаги и картона`}
        description="Порежем бумагу в любой формат или размер на собственном профессиональном оборудовании. Точность до миллиметра и высокое качество края."
        backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000"
        overlayColor="bg-indigo-950/85"
        buttons={[
          { label: 'Оставить заявку', href: '#request', primary: true },
          { label: 'Узнать стоимость', href: '#price' }
        ]}
      />

      {/* Наши услуги */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">Наши услуги</span>
            <h2 className="text-4xl font-bold font-rubik tracking-normal mt-3 mb-6">Услуги резки</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Подберём оптимальное решение под вашу задачу — от визиток и листовок до больших тиражей упаковки.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Резка в любой формат', desc: 'Порежем под нужный размер: А3, А4, А5 и нестандартные форматы.' },
              { title: 'Пакетная резка тиражей', desc: 'Быстро обрабатываем большие объёмы без потери точности.' },
              { title: 'Точная подрезка', desc: 'Аккуратные края, допуск до ±0.5 мм на профессиональном оборудовании.' },
              { title: 'Подготовка макета', desc: 'Поможем подготовить ТЗ и разметку под чистовой рез.' },
              { title: 'Упаковка и маркировка', desc: 'Упакуем и промаркируем партии по вашим требованиям.' },
              { title: 'Логистика и доставка', desc: 'Доставим по городу или отправим ТК по РФ — оперативно и надёжно.' }
            ].map((service, index) => (
              <div key={index} className="p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <h3 className="text-xl font-bold font-rubik mb-4">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Оборудование — Новый профессиональный дизайн */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 to-transparent rounded-full" />
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Заголовок */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full text-indigo-300 font-semibold tracking-wider uppercase text-sm mb-6">
                Оборудование
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold font-rubik tracking-normal text-white mb-6">
                Технические параметры
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Профессиональное оборудование для идеального результата
              </p>
            </motion.div>
          </div>

          {/* Сетка параметров */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {specs.map((spec, index) => {
              const IconComponent = spec.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 h-full">
                    {/* Иконка */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Значение */}
                    <div className="text-3xl lg:text-4xl font-bold font-rubik text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                      {spec.value}
                    </div>

                    {/* Название */}
                    <div className="text-lg font-semibold text-slate-300 mb-2">
                      {spec.label}
                    </div>

                    {/* Описание */}
                    <div className="text-sm text-slate-500">
                      {spec.desc}
                    </div>

                    {/* Декоративная линия */}
                    <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Дополнительная информация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-300 text-sm">Оборудование работает ежедневно с 9:00 до 18:00</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Форма заявки */}
      <section id="request" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Текст слева */}
            <div className="lg:w-1/2">
              <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">Обратная связь</span>
              <h2 className="text-4xl lg:text-5xl font-bold font-rubik tracking-normal mt-4 mb-8">
                Оставьте заявку на расчет стоимости
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Мы свяжемся с вами в течение 30 минут для уточнения всех деталей вашего проекта: 
                подберем формат, рассчитаем количество резов и предложим оптимальный вариант упаковки.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold font-rubik text-lg">Точность исполнения</h4>
                    <p className="text-slate-500">Гарантируем соблюдение размеров до ±0.5 мм</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold font-rubik text-lg">Любые тиражи</h4>
                    <p className="text-slate-500">Работаем как с частными заказами, так и с крупным оптом</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Форма справа */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-slate-50 p-8 lg:p-12 rounded-[3rem] border border-slate-100 relative">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                          <label className="text-sm font-semibold text-slate-700">Ваше имя</label>
                          <input
                            required
                            type="text"
                            placeholder="Иван Иванов"
                            className="w-full h-14 px-5 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-600"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="text-sm font-semibold text-slate-700">Телефон</label>
                          <input
                            required
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            className="w-full h-14 px-5 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-600"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold text-slate-700">Email</label>
                        <input
                          required
                          type="email"
                          placeholder="example@mail.ru"
                          className="w-full h-14 px-5 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-600"
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold text-slate-700">Детали проекта</label>
                        <textarea
                          rows={4}
                          placeholder="Расскажите о материале, формате и тираже..."
                          className="w-full p-5 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none text-slate-600"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Оставить заявку
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold font-rubik mb-4">Заявка успешно отправлена!</h3>
                      <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        Спасибо за ваше обращение. Наш специалист свяжется с вами в течение 30 минут для обсуждения деталей.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Отправить еще одну заявку
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CuttingPage;
