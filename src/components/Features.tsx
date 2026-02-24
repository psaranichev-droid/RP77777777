import { motion } from 'framer-motion';
import { Cpu, Layout, FastForward, CheckCircle, Zap, Shield } from 'lucide-react';
import { staggerChild } from '../utils/animations';

const features = [
  {
    title: 'Бесплатная доставка',
    description: 'Бесплатная доставка по всей стране при заказе от 5000 ₽. Никаких скрытых платежей.',
    icon: FastForward,
    color: 'bg-orange-500',
  },
  {
    title: 'Безопасная оплата',
    description: 'Мы используем 256-битное SSL-шифрование для защиты ваших платежных данных.',
    icon: Shield,
    color: 'bg-indigo-600',
  },
  {
    title: 'Поддержка 24/7',
    description: 'Наша команда поддержки готова помочь вам в любое время суток.',
    icon: Cpu,
    color: 'bg-emerald-500',
  },
  {
    title: 'Легкий возврат',
    description: 'Не подошло? Верните товар в течение 30 дней и получите полный возврат средств.',
    icon: Layout,
    color: 'bg-blue-600',
  },
  {
    title: 'Экологичность',
    description: 'Вся наша упаковка на 100% пригодна для вторичной переработки и экологична.',
    icon: Zap,
    color: 'bg-yellow-500',
  },
  {
    title: 'Гарантия качества',
    description: 'Каждый лист проверяется вручную перед отправкой, чтобы гарантировать совершенство.',
    icon: CheckCircle,
    color: 'bg-rose-500',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold font-rubik text-slate-900 mb-4 tracking-normal">
            Почему выбирают нас?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ощутите разницу с нашим стремлением к качеству, скорости и исключительному сервису.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              {...staggerChild(index)}
              className="group p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-rubik tracking-normal text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
