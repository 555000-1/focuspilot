import { useState } from "react";
import Fireflies from "@/components/Fireflies";
import Reveal from "@/components/Reveal";
import {
  PRO_PRICE_MONTHLY,
  PRO_PRICE_YEARLY,
  FREE_TASK_LIMIT,
} from "@/lib/planner";

/* ================= ЛЕНДИНГ ================= */

export default function Landing({
  onLaunch,
  onPro,
}: {
  onLaunch: () => void;
  onPro: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Nav onLaunch={onLaunch} />
      <Hero onLaunch={onLaunch} />
      <Problem />
      <HowItWorks onLaunch={onLaunch} />
      <Features />
      <Pricing onPro={onPro} onLaunch={onLaunch} />
      <Faq />
      <FinalCta onLaunch={onLaunch} />
      <Footer />
    </div>
  );
}

/* ---------------- Навигация ---------------- */

function Nav({ onLaunch }: { onLaunch: () => void }) {
  return (
    <header className="nav-frosted fixed top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">
            FocusPilot
          </span>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-neutral-400 md:flex">
          <a href="#how" className="transition-colors duration-300 hover:text-white">
            Как работает
          </a>
          <a href="#features" className="transition-colors duration-300 hover:text-white">
            Возможности
          </a>
          <a href="#pricing" className="transition-colors duration-300 hover:text-white">
            Тарифы
          </a>
          <a href="#faq" className="transition-colors duration-300 hover:text-white">
            FAQ
          </a>
        </nav>
        <button
          onClick={onLaunch}
          className="rounded-full bg-[#ff6b00] px-5 py-2 text-sm font-semibold text-white btn-glow"
        >
          Открыть планировщик
        </button>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11" stroke="#ff6b00" strokeWidth="2" />
      <path d="M13 7v6l4.5 3" stroke="#ff6b00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <Fireflies count={46} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,0,0.08),transparent_60%)]" />
      <div className="hero-mask relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs tracking-wide text-neutral-300">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" />
          Уже помогает людям закрывать день без хаоса
        </div>
        <h1 className="text-balance text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl">
          День под контролем
          <br />
          <span className="text-[#ff6b00]">за 60 секунд</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-neutral-400">
          Вбрось все задачи — FocusPilot расставит приоритеты, отсечёт лишнее
          и построит реалистичный план дня с точным временем. Для ленивых —
          один клик. Для перфекционистов — полный контроль.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onLaunch}
            className="rounded-full bg-[#ff6b00] px-9 py-4 text-base font-semibold text-white btn-glow"
          >
            Построить мой план — бесплатно
          </button>
          <a
            href="#how"
            className="rounded-full border border-white/15 px-9 py-4 text-base font-medium text-neutral-300 transition-colors duration-300 hover:border-white/40 hover:text-white"
          >
            Как это работает
          </a>
        </div>
        <p className="mt-6 text-xs text-neutral-500">
          Без регистрации · Данные остаются в твоём браузере
        </p>
      </div>
    </section>
  );
}

/* ---------------- Боль ---------------- */

function Problem() {
  const pains = [
    {
      n: "01",
      t: "Хаос вместо дня",
      d: "23 открытые вкладки, список дел на салфетке и ощущение, что день прошёл впустую.",
    },
    {
      n: "02",
      t: "Важное откладывается",
      d: "Мелочи съедают утро, а задачи, которые реально двигают жизнь, висят неделями.",
    },
    {
      n: "03",
      t: "Решения утомляют",
      d: "Каждый выбор «что делать дальше» жжёт энергию. К вечеру её просто не остаётся.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="section-marker">Знакомо?</p>
        <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Проблема не в лени. Проблема в отсутствии системы
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
        {pains.map((p, i) => (
          <Reveal key={p.n} delay={i * 120} className="bg-background">
            <div className="h-full bg-[#0d0d0d] p-9">
              <span className="font-mono text-sm text-[#ff6b00]">{p.n}</span>
              <h3 className="mt-4 text-xl font-semibold">{p.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{p.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Как работает ---------------- */

function HowItWorks({ onLaunch }: { onLaunch: () => void }) {
  const steps = [
    {
      tag: "Вброс",
      t: "Выгрузи всё из головы",
      d: "Пиши задачи как есть — без структуры. FocusPilot сам попросит уточнить три вещи: сколько времени займёт, насколько это важно и когда дедлайн.",
    },
    {
      tag: "Сортировка",
      t: "Алгоритм расставляет приоритеты",
      d: "Матрица Эйзенхауэра + скоринг по важности, срочности и усилиям. Лишнее отправляется в корзину без жалости — это тоже часть метода.",
    },
    {
      tag: "Выполнение",
      t: "Получи план с точным временем",
      d: "Таймлайн от текущего момента до финиша: что делать сейчас, что через час и во сколько ты освободишься. Осталось только следовать плану.",
    },
  ];
  return (
    <section id="how" className="border-t border-white/5 bg-[#0c0c0c] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="section-marker">Как работает</p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            Три шага. Меньше минуты.
          </h2>
        </Reveal>
        <div className="mt-16 space-y-20">
          {steps.map((s, i) => (
            <Reveal key={s.tag} delay={i * 100}>
              <div
                className={`grid items-center gap-10 md:grid-cols-2 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <span className="inline-block rounded-full border border-[#ff6b00]/40 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#ff6b00]">
                    {s.tag}
                  </span>
                  <h3 className="mt-5 text-2xl font-bold md:text-3xl">{s.t}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-neutral-400">{s.d}</p>
                </div>
                <StepVisual index={i} />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-20 text-center">
          <button
            onClick={onLaunch}
            className="rounded-full bg-[#ff6b00] px-9 py-4 font-semibold text-white btn-glow"
          >
            Попробовать прямо сейчас
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function StepVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-[0_48px_80px_-24px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3.5">
          <span className="text-sm text-neutral-500">Написать статью для блога…</span>
          <span className="ml-auto rounded-md bg-[#ff6b00] px-2.5 py-1 text-[11px] font-bold text-white">
            + Добавить
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {["Ответить клиенту", "Купить продукты", "Разобрать почту"].map((t) => (
            <div
              key={t}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0a0a0a] px-4 py-3"
            >
              <span className="h-4 w-4 rounded border border-white/20" />
              <span className="text-sm text-neutral-300">{t}</span>
            </div>
          ))}
        </div>
      </div>
    );
  if (index === 1)
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          { t: "Сделай сейчас", c: "#ff6b00", n: 2 },
          { t: "Запланируй", c: "#3b82f6", n: 3 },
          { t: "Делегируй", c: "#eab308", n: 1 },
          { t: "Удали", c: "#666", n: 4 },
        ].map((q) => (
          <div
            key={q.t}
            className="rounded-2xl border border-white/10 bg-[#111] p-5 shadow-[0_48px_80px_-24px_rgba(0,0,0,0.7)]"
          >
            <div className="h-1 w-8 rounded-full" style={{ background: q.c }} />
            <p className="mt-3 text-sm font-semibold">{q.t}</p>
            <p className="mt-1 font-mono text-2xl font-bold" style={{ color: q.c }}>
              {q.n}
            </p>
          </div>
        ))}
      </div>
    );
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-6 shadow-[0_48px_80px_-24px_rgba(0,0,0,0.7)]">
      {[
        ["14:00", "Написать статью", true],
        ["15:30", "Ответить клиенту", false],
        ["16:00", "Разобрать почту", false],
      ].map(([time, title, active]) => (
        <div
          key={time as string}
          className={`flex items-center gap-4 border-l-2 py-3 pl-4 ${
            active ? "border-[#ff6b00]" : "border-white/10"
          }`}
        >
          <span className="font-mono text-sm text-neutral-400">{time}</span>
          <span className={`text-sm ${active ? "font-semibold text-white" : "text-neutral-400"}`}>
            {title}
          </span>
          {active ? (
            <span className="ml-auto rounded-full bg-[#ff6b00]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#ff6b00]">
              СЕЙЧАС
            </span>
          ) : null}
        </div>
      ))}
      <p className="mt-4 border-t border-white/10 pt-4 text-sm text-neutral-400">
        Финиш в <span className="font-semibold text-white">17:20</span> — вечер свободен
      </p>
    </div>
  );
}

/* ---------------- Возможности ---------------- */

function Features() {
  const feats = [
    {
      t: "Скоринг приоритетов",
      d: "Каждая задача получает объективный балл: важность × срочность × усилия. Никаких споров с собой.",
    },
    {
      t: "Матрица Эйзенхауэра",
      d: "Автоматическое распределение по четырём квадрантам. Метод, проверенный 70 годами.",
    },
    {
      t: "Таймлайн с перерывами",
      d: "План строится от текущей минуты с паузами между задачами — реалистичный, а не героический.",
    },
    {
      t: "Фокус-режим с таймером",
      d: "Одна задача на экране, обратный отсчёт, ничего лишнего. Режим «сделай и забудь».",
    },
    {
      t: "Детектор перегруза",
      d: "Если план не помещается в день — FocusPilot честно скажет об этом и предложит, что перенести.",
    },
    {
      t: "Ноль регистрации",
      d: "Открыл — работаешь. Данные хранятся локально, никто не читает твои планы.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="section-marker">Возможности</p>
        <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Всё, что нужно. Ничего лишнего.
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {feats.map((f, i) => (
          <Reveal key={f.t} delay={(i % 3) * 100} className="bg-background">
            <div className="h-full bg-[#0d0d0d] p-8 transition-colors duration-300 hover:bg-[#101010]">
              <div className="h-1 w-8 rounded-full bg-[#ff6b00]" />
              <h3 className="mt-5 text-lg font-semibold">{f.t}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-neutral-400">{f.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Тарифы ---------------- */

function Pricing({ onPro, onLaunch }: { onPro: () => void; onLaunch: () => void }) {
  return (
    <section id="pricing" className="border-t border-white/5 bg-[#0c0c0c] py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <p className="section-marker justify-center" style={{ justifyContent: "center" }}>
            Тарифы
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            Начни бесплатно. Расти с Pro.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#111] p-9">
              <h3 className="text-lg font-semibold text-neutral-300">Бесплатный</h3>
              <p className="mt-5">
                <span className="text-5xl font-bold">$0</span>
                <span className="ml-2 text-sm text-neutral-500">навсегда</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3.5 text-sm text-neutral-400">
                {[
                  `До ${FREE_TASK_LIMIT} активных задач`,
                  "Скоринг приоритетов",
                  "Матрица Эйзенхауэра",
                  "Таймлайн дня",
                  "Без регистрации",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check /> {x}
                  </li>
                ))}
              </ul>
              <button
                onClick={onLaunch}
                className="mt-9 rounded-full border border-white/20 py-3.5 font-semibold text-white transition-colors duration-300 hover:border-white/50"
              >
                Начать бесплатно
              </button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative flex h-full flex-col rounded-2xl border border-[#ff6b00]/50 bg-[#131110] p-9 shadow-[0_0_60px_-12px_rgba(255,107,0,0.25)]">
              <span className="absolute -top-3.5 left-9 rounded-full bg-[#ff6b00] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Выбор продуктивных
              </span>
              <h3 className="text-lg font-semibold text-[#ff6b00]">Pro</h3>
              <p className="mt-5">
                <span className="text-5xl font-bold">${PRO_PRICE_MONTHLY}</span>
                <span className="ml-2 text-sm text-neutral-500">/ месяц</span>
              </p>
              <p className="mt-1.5 text-sm text-neutral-500">
                или ${PRO_PRICE_YEARLY}/год — два месяца в подарок
              </p>
              <ul className="mt-8 flex-1 space-y-3.5 text-sm text-neutral-300">
                {[
                  "Безлимитные задачи и планы",
                  "Фокус-режим с таймером",
                  "Детектор перегруза дня",
                  "Статистика продуктивности",
                  "Повторяющиеся задачи",
                  "Приоритетная поддержка",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check orange /> {x}
                  </li>
                ))}
              </ul>
              <button
                onClick={onPro}
                className="mt-9 rounded-full bg-[#ff6b00] py-3.5 font-semibold text-white btn-glow"
              >
                Перейти на Pro
              </button>
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-10 text-center">
          <p className="text-sm text-neutral-500">
            Цена двух чашек кофе в месяц — за дни, которые больше не проходят впустую.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Check({ orange }: { orange?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M3.5 9.5l3.5 3.5 7.5-8"
        stroke={orange ? "#ff6b00" : "#8a8a8a"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- FAQ ---------------- */

function Faq() {
  const items = [
    {
      q: "Это очередной список дел?",
      a: "Нет. Список дел просто хранит задачи. FocusPilot принимает за тебя решение, что делать прямо сейчас — на основе важности, дедлайнов и твоей энергии. Это разница между записной книжкой и личным ассистентом.",
    },
    {
      q: "Подойдёт, если я прокрастинатор?",
      a: "Именно для тебя. Главная причина прокрастинации — неясность следующего шага. FocusPilot убирает выбор: алгоритм показывает одну задачу, а таймер помогает просто начать.",
      open: true,
    },
    {
      q: "Где хранятся мои данные?",
      a: "В твоём браузере. Мы не собираем и не видим твои задачи — всё работает локально, без аккаунтов и облаков.",
    },
    {
      q: "Что будет, если отменить Pro?",
      a: "Ничего страшного: вернёшься на бесплатный тариф, твои задачи останутся на месте. Никаких блокировок и штрафов.",
    },
    {
      q: "Сколько времени занимает планирование?",
      a: "Около минуты в день. Вбросил задачи утром — получил готовый план с таймлайном. Дальше просто следуешь ему.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-28">
      <Reveal>
        <p className="section-marker">FAQ</p>
        <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
          Частые вопросы
        </h2>
      </Reveal>
      <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {items.map((it) => (
          <FaqItem key={it.q} q={it.q} a={it.a} defaultOpen={it.open} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="text-base font-semibold">{q}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="shrink-0 transition-transform duration-300"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
          }}
          aria-hidden="true"
        >
          <path d="M4 7l5 5 5-5" stroke="#ff6b00" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 pr-10 text-sm leading-relaxed text-neutral-400">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Финальный CTA + футер ---------------- */

function FinalCta({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-32">
      <Fireflies count={30} />
      <Reveal className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
          Следующий продуктивный день начинается{" "}
          <span className="text-[#ff6b00]">сейчас</span>
        </h2>
        <button
          onClick={onLaunch}
          className="mt-10 rounded-full bg-[#ff6b00] px-10 py-4 text-lg font-semibold text-white btn-glow"
        >
          Построить план дня
        </button>
        <p className="mt-5 text-xs text-neutral-500">60 секунд — и ты знаешь, что делать</p>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-neutral-500 md:flex-row">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span>FocusPilot — оптимизатор дня</span>
        </div>
        <p>© {new Date().getFullYear()} · Сделано для людей, которые ценят своё время</p>
      </div>
    </footer>
  );
}
