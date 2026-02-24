import Hero from '../components/Hero';
import { Truck, MapPin, CreditCard, Scissors, Package } from 'lucide-react';

const WholesalePage = () => {
  
  const priceData = [
    { id: 101, product: 'Офсетная бумага Royal Paper', format: 'A4', density: '80 г/м²', price10: 320, price50: 290, image: "https://images.unsplash.com/photo-1586075010620-2276188dc21f?w=400&q=80" },
    { id: 102, product: 'Офсетная бумага Royal Paper', format: 'A4', density: '120 г/м²', price10: 480, price50: 440, image: "https://images.unsplash.com/photo-1586075010620-2276188dc21f?w=400&q=80" },
    { id: 103, product: 'Офсетная бумага Royal Paper', format: 'A5', density: '80 г/м²', price10: 180, price50: 160, image: "https://images.unsplash.com/photo-1586075010620-2276188dc21f?w=400&q=80" },
    { id: 104, product: 'Мелованная бумага (глянец)', format: 'A4', density: '130 г/м²', price10: 650, price50: 590, image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?w=400&q=80" },
    { id: 105, product: 'Мелованная бумага (мат)', format: 'A4', density: '130 г/м²', price10: 680, price50: 620, image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?w=400&q=80" },
    { id: 106, product: 'Мелованный картон', format: 'A4', density: '250 г/м²', price10: 890, price50: 820, image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80" },
    { id: 107, product: 'Мелованный картон', format: 'A4', density: '300 г/м²', price10: 1050, price50: 960, image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80" },
  ];

  return (
    <div className="bg-white">
      <Hero
        title={`Оптовые цены на офсетную
и мелованную бумагу и картон`}
        description="Понимаем, как важна для вас надежность, стабильность и универсальность материалов, чтобы успешно выполнять разнообразные заказы ваших клиентов, вне зависимости от используемого оборудования."
        backgroundImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000"
        overlayColor="bg-indigo-950/80"
        buttons={[
          { label: 'Получить прайс', href: '#price', primary: true },
          { label: 'Связаться с нами', href: 'mailto:info@onlook.ru' }
        ]}
      />

      {/* Info Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold font-rubik tracking-normal text-slate-900 mb-6">
              Это базовый минимум того, что нужно знать о нас
            </h2>
            <p className="text-xl text-slate-600 font-inter">
              Надёжный партнёр для вашего бизнеса — доставка, оплата, индивидуальный подход
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-bold font-rubik mb-4">Доставка</h3>
              <p className="text-slate-600 leading-relaxed font-inter">
                Мы осуществляем перевозки через транспортные логистические компании, поэтому для нас нет границ. Доставку до транспортных компаний мы осуществляем бесплатно.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold font-rubik mb-4">Где мы находимся</h3>
              <p className="text-slate-600 leading-relaxed font-inter">
                Мы располагаемся в Нижнем Новгороде по адресу: улица Баумана, 48, корпус 1. Всегда рады оказать аудиенцию в нашем комфортном шоуруме.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold font-rubik mb-4">Оплата</h3>
              <p className="text-slate-600 leading-relaxed font-inter">
                Мы работаем с любыми категориями клиентов: юридическими и физическими лицами. По запросу отправим торговое предложение.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <Scissors size={24} />
              </div>
              <h3 className="text-xl font-bold font-rubik mb-4">Индивидуальный размер</h3>
              <p className="text-slate-600 leading-relaxed font-inter">
                У нас собственное профессиональное оборудование для резки, поэтому мы можем изготовить материал практически любого размера, который вам нужен.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold font-rubik mb-4">Образцы</h3>
              <p className="text-slate-600 leading-relaxed font-inter">
                Если вы еще не убедились в качестве нашей продукции, предлагаем вам приобрести её в наших магазинах на маркетплейсах. Там вы найдете весь ассортимент.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Price List Section */}
      <section id="price" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold font-rubik tracking-normal text-slate-900 mb-6">
              Прайс-лист
            </h2>
            <p className="text-xl text-slate-600 font-inter">
              Актуальные оптовые цены на офсетную бумагу форматов А4 и А5
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-5 px-6 font-rubik font-semibold">Продукт</th>
                    <th className="py-5 px-6 font-rubik font-semibold">Формат</th>
                    <th className="py-5 px-6 font-rubik font-semibold">Плотность</th>
                    <th className="py-5 px-6 font-rubik font-semibold text-center">Цена (10+)</th>
                    <th className="py-5 px-6 font-rubik font-semibold text-center">Цена (50+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priceData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-5 px-6 font-medium text-slate-900">{item.product}</td>
                      <td className="py-5 px-6 text-slate-600">{item.format}</td>
                      <td className="py-5 px-6 text-slate-600">{item.density}</td>
                      <td className="py-5 px-6 font-bold text-slate-900 text-center">{item.price10} ₽</td>
                      <td className="py-5 px-6 font-bold text-indigo-600 text-center">{item.price50} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-100/50 border-t border-slate-200">
              <p className="text-sm text-slate-500 font-inter">
                Цены указаны за пачку (500 листов). Актуальны на 2024 г.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WholesalePage;
