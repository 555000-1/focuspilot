// FocusPilot — ядро оптимизации задач
// Алгоритм: взвешенный скоринг важности, срочности, усилий и энергии

export type Energy = "low" | "medium" | "high";
export type Deadline = "today" | "tomorrow" | "week" | "someday";

export interface Task {
  id: string;
  title: string;
  minutes: number; // оценка времени
  impact: 1 | 2 | 3; // важность: 1 — мелочь, 3 — двигает жизнь вперёд
  deadline: Deadline;
  energy: Energy; // сколько энергии требует
  done: boolean;
  createdAt: number;
}

export const FREE_TASK_LIMIT = 5;

export const DEADLINE_LABEL: Record<Deadline, string> = {
  today: "Сегодня",
  tomorrow: "Завтра",
  week: "На этой неделе",
  someday: "Когда-нибудь",
};

export const ENERGY_LABEL: Record<Energy, string> = {
  high: "Нужен фокус",
  medium: "Средняя",
  low: "На автопилоте",
};

const DEADLINE_SCORE: Record<Deadline, number> = {
  today: 30,
  tomorrow: 18,
  week: 8,
  someday: 0,
};

const ENERGY_ORDER: Record<Energy, number> = { high: 0, medium: 1, low: 2 };

/** Скор задачи: важность × 12 + дедлайн + бонус за быструю победу */
export function scoreTask(t: Task): number {
  let s = t.impact * 12 + DEADLINE_SCORE[t.deadline];
  if (t.minutes <= 15) s += 10; // быстрые победы создают инерцию
  else if (t.minutes <= 45) s += 4;
  if (t.impact === 3 && t.deadline === "today") s += 8; // критично
  return s;
}

export type Quadrant = "do" | "schedule" | "delegate" | "drop";

/** Матрица Эйзенхауэра на основе важности и срочности */
export function quadrantOf(t: Task): Quadrant {
  const urgent = t.deadline === "today" || t.deadline === "tomorrow";
  const important = t.impact >= 2;
  if (urgent && important) return "do";
  if (!urgent && important) return "schedule";
  if (urgent && !important) return "delegate";
  return "drop";
}

export const QUADRANT_META: Record<
  Quadrant,
  { title: string; hint: string; color: string }
> = {
  do: { title: "Сделай сейчас", hint: "Важно и срочно", color: "#ff6b00" },
  schedule: { title: "Запланируй", hint: "Важно, не горит", color: "#3b82f6" },
  delegate: { title: "Упрости / делегируй", hint: "Срочно, но не важно", color: "#eab308" },
  drop: { title: "Удали без жалости", hint: "Ни важно, ни срочно", color: "#666666" },
};

/** Оптимальный порядок выполнения: скор ↓, внутри — энергия ↓, время ↑ */
export function buildPlan(tasks: Task[]): Task[] {
  return tasks
    .filter((t) => !t.done && quadrantOf(t) !== "drop")
    .sort((a, b) => {
      const ds = scoreTask(b) - scoreTask(a);
      if (ds !== 0) return ds;
      const de = ENERGY_ORDER[a.energy] - ENERGY_ORDER[b.energy];
      if (de !== 0) return de;
      return a.minutes - b.minutes;
    });
}

export interface PlanSlot {
  task: Task;
  start: Date;
  end: Date;
}

/** Таймлайн дня от текущего момента с перерывами 10 мин между задачами */
export function buildTimeline(plan: Task[], now = new Date()): PlanSlot[] {
  const slots: PlanSlot[] = [];
  let cursor = new Date(now.getTime());
  for (const t of plan) {
    const start = new Date(cursor.getTime());
    const end = new Date(start.getTime() + t.minutes * 60000);
    slots.push({ task: t, start, end });
    cursor = new Date(end.getTime() + 10 * 60000); // перерыв
  }
  return slots;
}

export function fmtTime(d: Date): string {
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function totalMinutes(tasks: Task[]): number {
  return tasks.reduce((acc, t) => acc + t.minutes, 0);
}

export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} мин`;
  if (m === 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

/* ---------------- Хранилище (localStorage) ---------------- */

const KEY_TASKS = "focuspilot.tasks.v1";
const KEY_PRO = "focuspilot.pro.v1";

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(KEY_TASKS);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(KEY_TASKS, JSON.stringify(tasks));
}

export function isPro(): boolean {
  return localStorage.getItem(KEY_PRO) === "1";
}

export function setPro(v: boolean): void {
  localStorage.setItem(KEY_PRO, v ? "1" : "0");
}

/** Единственное место, которое нужно поменять владельцу:
 *  вставь сюда свою ссылку Stripe Payment Link (создаётся бесплатно за 5 минут) */
export const STRIPE_PAYMENT_LINK = ""; // например "https://buy.stripe.com/xxxx"

export const PRO_PRICE_MONTHLY = 9;
export const PRO_PRICE_YEARLY = 79;
