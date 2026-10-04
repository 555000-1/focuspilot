import { useEffect, useMemo, useState } from "react";
import {
  buildPlan,
  buildTimeline,
  fmtDuration,
  fmtTime,
  isPro,
  loadTasks,
  quadrantOf,
  QUADRANT_META,
  saveTasks,
  scoreTask,
  totalMinutes,
  FREE_TASK_LIMIT,
  DEADLINE_LABEL,
  ENERGY_LABEL,
  type Deadline,
  type Energy,
  type Quadrant,
  type Task,
} from "@/lib/planner";
import PaywallModal from "@/sections/PaywallModal";

const WORKDAY_MINUTES = 8 * 60;

export default function Planner({
  onHome,
  openPaywallOnMount,
}: {
  onHome: () => void;
  openPaywallOnMount?: boolean;
}) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [pro, setProState] = useState(isPro());
  const [paywall, setPaywall] = useState<string | null>(
    openPaywallOnMount && !isPro()
      ? "Безлимитные задачи, фокус-таймер и статистика — всё это Pro."
      : null
  );
  const [focusId, setFocusId] = useState<string | null>(null);

  // форма
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [impact, setImpact] = useState<1 | 2 | 3>(2);
  const [deadline, setDeadline] = useState<Deadline>("today");
  const [energy, setEnergy] = useState<Energy>("medium");

  useEffect(() => saveTasks(tasks), [tasks]);

  const activeTasks = tasks.filter((t) => !t.done);
  const plan = useMemo(() => buildPlan(tasks), [tasks]);
  const timeline = useMemo(() => buildTimeline(plan), [plan]);
  const load = totalMinutes(activeTasks);
  const overloaded = load > WORKDAY_MINUTES;
  const finish = timeline.length ? timeline[timeline.length - 1].end : null;

  const quadCount = useMemo(() => {
    const m: Record<Quadrant, number> = { do: 0, schedule: 0, delegate: 0, drop: 0 };
    activeTasks.forEach((t) => (m[quadrantOf(t)] += 1));
    return m;
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  function addTask() {
    const t = title.trim();
    if (!t) return;
    if (!pro && activeTasks.length >= FREE_TASK_LIMIT) {
      setPaywall(
        `На бесплатном тарифе — до ${FREE_TASK_LIMIT} активных задач. С Pro планируй без ограничений: проекты, недели, всю жизнь.`
      );
      return;
    }
    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title: t,
        minutes,
        impact,
        deadline,
        energy,
        done: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setTitle("");
  }

  function toggleDone(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    if (focusId === id) setFocusId(null);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (focusId === id) setFocusId(null);
  }

  function startFocus() {
    if (!pro) {
      setPaywall(
        "Фокус-режим с таймером — это Pro. Одна задача на экране, обратный отсчёт, ноль отвлечений."
      );
      return;
    }
    if (plan.length) setFocusId(plan[0].id);
  }

  const focusTask = focusId ? tasks.find((t) => t.id === focusId) : null;

  return (
    <div className="app-grid-bg min-h-screen bg-background">
      {/* верхняя панель */}
      <header className="nav-frosted sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <button
            onClick={onHome}
            className="flex items-center gap-2 text-sm text-neutral-400 transition-colors duration-300 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            На главную
          </button>
          <div className="flex items-center gap-3">
            {!pro ? (
              <>
                <span className="hidden text-xs text-neutral-500 sm:block">
                  {activeTasks.length}/{FREE_TASK_LIMIT} задач · бесплатный тариф
                </span>
                <button
                  onClick={() =>
                    setPaywall("Безлимитные задачи, фокус-таймер и статистика — всё это Pro.")
                  }
                  className="rounded-full bg-[#ff6b00] px-4 py-1.5 text-xs font-bold text-white btn-glow"
                >
                  Перейти на Pro
                </button>
              </>
            ) : (
              <span className="rounded-full border border-[#ff6b00]/50 bg-[#ff6b00]/10 px-3.5 py-1 text-xs font-bold text-[#ff6b00]">
                PRO АКТИВЕН
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">План на сегодня</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Вбрось задачи — алгоритм расставит приоритеты и построит таймлайн.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* -------- ЛЕВАЯ КОЛОНКА: ввод + список -------- */}
          <div className="space-y-6">
            {/* форма */}
            <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Что нужно сделать?"
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-neutral-600 focus:border-[#ff6b00]/60"
              />

              <div className="mt-5 space-y-4">
                <Field label={`Время: ${fmtDuration(minutes)}`}>
                  <input
                    type="range"
                    min={5}
                    max={240}
                    step={5}
                    value={minutes}
                    onChange={(e) => setMinutes(+e.target.value)}
                    className="w-full accent-[#ff6b00]"
                  />
                </Field>

                <Field label="Важность">
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        [1, "Мелочь"],
                        [2, "Нормальная"],
                        [3, "Двигает вперёд"],
                      ] as const
                    ).map(([v, l]) => (
                      <ChoiceBtn key={v} active={impact === v} onClick={() => setImpact(v)}>
                        {l}
                      </ChoiceBtn>
                    ))}
                  </div>
                </Field>

                <Field label="Дедлайн">
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(DEADLINE_LABEL) as Deadline[]).map((d) => (
                      <ChoiceBtn key={d} active={deadline === d} onClick={() => setDeadline(d)}>
                        {DEADLINE_LABEL[d]}
                      </ChoiceBtn>
                    ))}
                  </div>
                </Field>

                <Field label="Энергия">
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(ENERGY_LABEL) as Energy[]).map((en) => (
                      <ChoiceBtn key={en} active={energy === en} onClick={() => setEnergy(en)}>
                        {ENERGY_LABEL[en]}
                      </ChoiceBtn>
                    ))}
                  </div>
                </Field>
              </div>

              <button
                onClick={addTask}
                className="mt-6 w-full rounded-full bg-[#ff6b00] py-3.5 font-semibold text-white btn-glow"
              >
                Добавить в план
              </button>
            </div>

            {/* квадранты */}
            {activeTasks.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                <p className="section-marker">Матрица</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {(Object.keys(QUADRANT_META) as Quadrant[]).map((q) => (
                    <div key={q} className="rounded-xl border border-white/5 bg-[#0a0a0a] p-4">
                      <div
                        className="h-1 w-7 rounded-full"
                        style={{ background: QUADRANT_META[q].color }}
                      />
                      <p className="mt-2.5 text-xs font-semibold">{QUADRANT_META[q].title}</p>
                      <p
                        className="mt-0.5 font-mono text-xl font-bold"
                        style={{ color: QUADRANT_META[q].color }}
                      >
                        {quadCount[q]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* список задач */}
            {tasks.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                <p className="section-marker">Все задачи</p>
                <ul className="mt-5 space-y-2">
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-300 ${
                        t.done
                          ? "border-white/5 bg-[#0a0a0a] opacity-45"
                          : "border-white/10 bg-[#0a0a0a] hover:border-white/25"
                      }`}
                    >
                      <button
                        onClick={() => toggleDone(t.id)}
                        aria-label="Выполнено"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          t.done ? "border-[#ff6b00] bg-[#ff6b00]" : "border-white/25"
                        }`}
                      >
                        {t.done && (
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M2 5.5l2.5 2.5L9 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm ${t.done ? "line-through" : ""}`}>
                          {t.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          {fmtDuration(t.minutes)} · {DEADLINE_LABEL[t.deadline]} · скор{" "}
                          <span className="font-mono text-[#ff6b00]">{scoreTask(t)}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeTask(t.id)}
                        aria-label="Удалить"
                        className="text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M3 3l9 9M12 3l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* -------- ПРАВАЯ КОЛОНКА: план -------- */}
          <div className="space-y-6">
            {plan.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0d0d0d] p-10 text-center">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                  <circle cx="22" cy="22" r="18" stroke="#333" strokeWidth="2" />
                  <path d="M22 12v10l7 4.5" stroke="#ff6b00" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-500">
                  Добавь первую задачу слева — и здесь появится твой оптимальный план дня
                </p>
              </div>
            ) : (
              <>
                {/* сводка */}
                <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="section-marker">Твой план</p>
                      <p className="mt-3 text-2xl font-bold">
                        {plan.length} {plural(plan.length)} · {fmtDuration(load)}
                        {finish && (
                          <span className="ml-3 text-base font-medium text-neutral-400">
                            финиш ~{fmtTime(finish)}
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={startFocus}
                      className="pulse-ring rounded-full bg-[#ff6b00] px-6 py-3 text-sm font-bold text-white btn-glow"
                    >
                      ▶ Фокус-режим
                    </button>
                  </div>
                  {overloaded && (
                    <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      Перегруз: задач на {fmtDuration(load)} — это больше 8-часового дня.
                      Перенеси задачи с низким приоритетом на завтра.
                    </div>
                  )}
                  {!overloaded && load > 0 && (
                    <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                      План реалистичен — всё помещается в рабочий день.
                    </div>
                  )}
                </div>

                {/* таймлайн */}
                <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
                  <p className="section-marker">Таймлайн</p>
                  <ol className="mt-6 space-y-0">
                    {timeline.map((slot, i) => (
                      <li key={slot.task.id} className="relative flex gap-5 pb-2">
                        <div className="flex flex-col items-center">
                          <span
                            className={`z-10 mt-1 h-3 w-3 rounded-full border-2 ${
                              i === 0
                                ? "border-[#ff6b00] bg-[#ff6b00]"
                                : "border-white/25 bg-[#111]"
                            }`}
                          />
                          {i < timeline.length - 1 && (
                            <span className="w-px flex-1 bg-white/10" />
                          )}
                        </div>
                        <div
                          className={`mb-4 flex-1 rounded-xl border px-4 py-3.5 ${
                            i === 0
                              ? "border-[#ff6b00]/40 bg-[#ff6b00]/5"
                              : "border-white/5 bg-[#0a0a0a]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-mono text-xs text-neutral-400">
                              {fmtTime(slot.start)}–{fmtTime(slot.end)}
                            </span>
                            {i === 0 && (
                              <span className="rounded-full bg-[#ff6b00] px-2 py-0.5 text-[10px] font-bold text-white">
                                ДЕЛАЙ СЕЙЧАС
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm font-medium">{slot.task.title}</p>
                          <p className="mt-0.5 text-[11px] text-neutral-500">
                            {ENERGY_LABEL[slot.task.energy]} · +10 мин перерыв после
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* фокус-режим */}
      {focusTask && pro && (
        <FocusOverlay
          task={focusTask}
          onDone={() => toggleDone(focusTask.id)}
          onClose={() => setFocusId(null)}
        />
      )}

      {paywall && (
        <PaywallModal
          reason={paywall}
          onClose={() => setPaywall(null)}
          onActivated={() => {
            setProState(true);
            setPaywall(null);
          }}
        />
      )}
    </div>
  );
}

/* ---------- вспомогательные ---------- */

function plural(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "задача";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "задачи";
  return "задач";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function ChoiceBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors duration-200 ${
        active
          ? "border-[#ff6b00] bg-[#ff6b00]/15 text-[#ff6b00]"
          : "border-white/10 bg-[#0a0a0a] text-neutral-400 hover:border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------- фокус-режим с таймером ---------- */

function FocusOverlay({
  task,
  onDone,
  onClose,
}: {
  task: Task;
  onDone: () => void;
  onClose: () => void;
}) {
  const [left, setLeft] = useState(task.minutes * 60);

  useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [left]);

  const mm = Math.floor(Math.max(left, 0) / 60)
    .toString()
    .padStart(2, "0");
  const ss = (Math.max(left, 0) % 60).toString().padStart(2, "0");
  const progress = 1 - left / (task.minutes * 60);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#050505] px-6">
      <p className="section-marker">Фокус-режим</p>
      <h2 className="mt-8 max-w-xl text-balance text-center text-3xl font-bold md:text-4xl">
        {task.title}
      </h2>
      <div className="relative mt-12">
        <svg width="220" height="220" viewBox="0 0 220 220" aria-hidden="true">
          <circle cx="110" cy="110" r="96" stroke="#1c1c1c" strokeWidth="8" fill="none" />
          <circle
            cx="110"
            cy="110"
            r="96"
            stroke="#ff6b00"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 96}
            strokeDashoffset={2 * Math.PI * 96 * (1 - progress)}
            transform="rotate(-90 110 110)"
            style={{ transition: "stroke-dashoffset 0.9s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-5xl font-bold tabular-nums">
            {mm}:{ss}
          </span>
        </div>
      </div>
      <p className="mt-6 text-sm text-neutral-500">
        {left > 0 ? "Одна задача. Ничего больше." : "Время вышло — отличная работа!"}
      </p>
      <div className="mt-10 flex gap-4">
        <button
          onClick={onDone}
          className="rounded-full bg-[#ff6b00] px-8 py-3.5 font-semibold text-white btn-glow"
        >
          Готово ✓
        </button>
        <button
          onClick={onClose}
          className="rounded-full border border-white/15 px-8 py-3.5 text-neutral-300 transition-colors duration-300 hover:border-white/40"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
