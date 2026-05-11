# Перенесення на Cloudflare Pages

Покрокова інструкція переходу з GitHub Pages на Cloudflare Pages.
Очікувані вигоди: ~5× менше bandwidth (brotli з коробки), instant cache
purge, безкоштовний preview-environment на кожний PR, edge analytics.

> ⏱ Час: ~20 хв активної роботи + до 24 год очікування DNS-пропагації.

---

## 1. Створи Cloudflare акаунт (1 хв)

1. Перейди на <https://dash.cloudflare.com/sign-up>.
2. Зареєструйся через `aiclaster@skyservis.pro` (або інший email).
3. Підтверди email.

> Платити нічого не треба. **Free plan** покриває все потрібне для цього
> сайту: необмежений bandwidth, 500 builds/місяць, безліч request'ів.

---

## 2. Додай домен `ishawyha.dev` до Cloudflare (5 хв + чекати DNS)

Cloudflare Pages найкраще працює, коли DNS-зона домену лежить на самому
Cloudflare. Це дає тобі автоматичний HTTPS, brotli, edge-кеш і нульову
конфігурацію DDoS-захисту.

1. У дашборді: **Add a Site** → введи `ishawyha.dev` → **Continue**.
2. Обери **Free plan** → **Continue**.
3. Cloudflare просканує існуючі DNS-записи у твого реєстратора. Перевір,
   що там НЕ залишилось A-записів на GitHub Pages (`185.199.108.153` і
   подібні) — їх ми приберемо на кроці 5. Поки лиши як є, натисни
   **Continue**.
4. Cloudflare дасть тобі **2 нейм-сервери** (виглядають як
   `naya.ns.cloudflare.com` + `xavier.ns.cloudflare.com`).
5. Зайди в кабінет реєстратора домену (де купував `ishawyha.dev`) і зміни
   nameservers на ті, що дав Cloudflare.
6. Назад у Cloudflare натисни **Done, check nameservers**.

> 💡 Пропагація NS зазвичай 5-30 хв, але реєстратори вказують до 24 год.
> Поки чекаєш — переходь до кроку 3, він не залежить від DNS.

---

## 3. Створи Pages-проєкт (3 хв)

1. У сайдбарі Cloudflare: **Workers & Pages** → **Create application** →
   вкладка **Pages** → **Connect to Git**.
2. **Connect GitHub** → авторизуй Cloudflare → обери репозиторій
   `OlexiyOdarchuk/<репо-цього-лендингу>` (або як він називається).
3. **Begin setup**.

### Build configuration

| Field                       | Value                            |
| --------------------------- | -------------------------------- |
| **Project name**            | `ishawyha-dev`                   |
| **Production branch**       | `main`                           |
| **Framework preset**        | SvelteKit                        |
| **Build command**           | `npm run build`                  |
| **Build output directory**  | `build`                          |
| **Root directory**          | `/` (порожньо)                   |
| **Node version**            | `22` (через env var `NODE_VERSION`) |

Розгорни **Environment variables (advanced)** і додай:

```
NODE_VERSION=22
```

4. Натисни **Save and Deploy**. Перший білд триватиме ~2-3 хв.

Як билд успішний — Cloudflare дасть тобі URL вигляду
`https://ishawyha-dev.pages.dev`. Перевір, що сайт відкривається.

---

## 4. Прив'яжи кастомний домен (2 хв, після пропагації DNS)

1. У проєкті Pages: **Custom domains** → **Set up a custom domain**.
2. Введи `ishawyha.dev` → **Continue** → **Activate domain**.
3. Cloudflare сам додасть необхідні CNAME / A-записи у DNS-зону.

Через 1-2 хв `https://ishawyha.dev` буде вказувати на Cloudflare Pages.
HTTPS-сертифікат провіжниться автоматично.

> Хочеш ще й `www.ishawyha.dev` → повтори крок з `www.ishawyha.dev` і
> увімкни редирект `www` → apex у **Bulk Redirects**.

---

## 5. Вимкни GitHub Pages (1 хв)

Інакше будуть конкурувати два деплої.

1. У репозиторії на GitHub: **Settings** → **Pages**.
2. **Source** → **None** → **Save**.
3. Видали `static/CNAME` з репо (Cloudflare не використовує цей файл):

   ```bash
   git rm static/CNAME
   git commit -m "chore: drop GH Pages CNAME after Cloudflare migration"
   ```

4. Зупини / видали GitHub Actions workflow:

   ```bash
   git rm .github/workflows/deploy.yml
   git commit -m "chore: remove GH Pages workflow"
   ```

   (Cloudflare білдить сам, без GH Actions.)

5. Push:

   ```bash
   git push
   ```

   Перевір, що Cloudflare автоматично запустив новий білд на цей push.

---

## 6. Зроби кеш-агресивним для WASM (опційно, +5 хв)

WASM-файли (`piton-runner.wasm`, `piton-viz.wasm`) не змінюються між
білдами без зміни джерельника. Можна сказати Cloudflare кешувати їх
максимально довго.

Створи файл `static/_headers` (Cloudflare Pages читає його автоматично):

```
/*.wasm
  Cache-Control: public, max-age=31536000, immutable
  Content-Type: application/wasm

/wasm_exec*.js
  Cache-Control: public, max-age=31536000, immutable

/og.png
  Cache-Control: public, max-age=2592000

/favicon.svg
  Cache-Control: public, max-age=2592000
```

> ⚠️ Якщо `immutable` — обовʼязково додавай `?v=hash` коли оновлюєш WASM.
> Інакше старі клієнти ніколи не побачать нову версію. Для початку можеш
> поставити `max-age=86400` (1 день) без `immutable`.

---

## 7. Як перевірити, що brotli працює

```bash
curl -sIH "Accept-Encoding: br" https://ishawyha.dev/piton-viz.wasm \
    | grep -iE 'content-encoding|content-length'
```

Має відповісти:

```
content-encoding: br
content-length: ~5500000   # замість 23000000
```

Якщо `content-encoding` відсутній — Cloudflare ще не закешував файл, спробуй
запит ще раз через 30 секунд. Або в дашборді Cloudflare:
**Speed** → **Optimization** → переконайся, що **Brotli** увімкнено
(за замовчанням так).

---

## 8. Бонус: preview-deployments на PR

Cloudflare автоматично робить це. Кожен PR отримує посилання вигляду
`https://abc1234.ishawyha-dev.pages.dev` — можна тестити зміни без злиття.
Налаштовується в **Settings** → **Builds & deployments** → **Preview
deployments**.

---

## Якщо щось пішло не так

| Симптом                              | Що перевірити                                          |
| ------------------------------------ | ------------------------------------------------------ |
| Білд падає на `npm ci`               | `NODE_VERSION=22` env var у Pages settings             |
| 404 на `/piton-viz.wasm`             | `build/` дійсно містить файл після `npm run build`     |
| Старий сайт відкривається            | Очисти кеш браузера (Ctrl+Shift+R); DNS ще пропагує    |
| HTTPS-помилка                        | Зачекай 5-10 хв на видачу сертифіката; перевір DNS     |
| `404 not found` на сайті             | **Build output directory** виставлено в `build`        |
| Лендинг є, але `ishawyha.dev` не йде | **Custom domains** → перевір статус активації          |

---

## Що залишиться під GH Actions

Нічого, але якщо колись треба окремий CI (тести, lint без деплою) —
заведи новий workflow без `deploy-pages` крока. Cloudflare цьому не
заважає.
