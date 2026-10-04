import {
  PRO_PRICE_MONTHLY,
  PRO_PRICE_YEARLY,
  STRIPE_PAYMENT_LINK,
  setPro,
} from "@/lib/planner";

/** Модалка апгрейда на Pro.
 *  Если владелец вставил свою Stripe Payment Link — кнопка ведёт на оплату.
 *  В демо-режиме (ссылка не задана) Pro активируется локально для предпросмотра. */
export default function PaywallModal({
  reason,
  onClose,
  onActivated,
}: {
  reason: string;
  onClose: () => void;
  onActivated: () => void;
}) {
  const hasStripe = STRIPE_PAYMENT_LINK.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#ff6b00]/40 bg-[#111] p-8 shadow-[0_0_80px_-12px_rgba(255,107,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ff6b00]/15">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z"
              fill="#ff6b00"
            />
          </svg>
        </div>
        <h3 className="mt-5 text-center text-2xl font-bold">Это Pro-возможность</h3>
        <p className="mt-3 text-center text-sm leading-relaxed text-neutral-400">
          {reason}
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-[#ff6b00]">FocusPilot Pro</span>
            <span className="text-sm text-neutral-400">
              ${PRO_PRICE_MONTHLY}/мес · или ${PRO_PRICE_YEARLY}/год
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            <li>· Безлимитные задачи</li>
            <li>· Фокус-режим с таймером</li>
            <li>· Статистика и повторяющиеся задачи</li>
          </ul>
        </div>

        {hasStripe ? (
          <a
            href={STRIPE_PAYMENT_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-6 block rounded-full bg-[#ff6b00] py-3.5 text-center font-semibold text-white btn-glow"
          >
            Оформить Pro — ${PRO_PRICE_MONTHLY}/мес
          </a>
        ) : (
          <button
            onClick={() => {
              setPro(true);
              onActivated();
            }}
            className="mt-6 w-full rounded-full bg-[#ff6b00] py-3.5 font-semibold text-white btn-glow"
          >
            Активировать Pro (демо)
          </button>
        )}
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-full border border-white/15 py-3 text-sm text-neutral-400 transition-colors duration-300 hover:text-white"
        >
          Остаться на бесплатном
        </button>
        {!hasStripe && (
          <p className="mt-4 text-center text-[11px] leading-relaxed text-neutral-600">
            Демо-режим: владелец сайта подключает Stripe одной строкой в коде
          </p>
        )}
      </div>
    </div>
  );
}
