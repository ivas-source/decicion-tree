# Design System — Дерево решений

## Product Context
- **What this is:** Интерактивная образовательная страница, объясняющая алгоритм CART (дерево решений) с живой канвас-визуализацией и примерами кода
- **Who it's for:** Первокурсники технических специальностей; преподаватель показывает страницу на лекции
- **Space/industry:** Образовательный интерактив / учебный проект (ML-тема)
- **Project type:** Single-page educational article — текст + код + интерактивный канвас

## Aesthetic Direction
- **Direction:** Editorial/Precision — типографически управляемый, чистый, сигналит "сделано с заботой"
- **Decoration level:** Intentional — синтаксическая подсветка кода как главный декоративный элемент; больше ничего лишнего
- **Mood:** Серьёзный но доступный. Не скучный академический PDF, не стартаповский лендинг. Уровень хорошей документации.

## Typography
- **Display/Hero:** Satoshi (fontshare.com) — геометрический, современный, сигналит осознанный выбор шрифта
- **Body:** Instrument Sans (Google Fonts) — гуманистический гротеск, отличная читаемость длинных объяснений
- **UI/Labels:** Instrument Sans
- **Data/Tables:** n/a
- **Code:** JetBrains Mono (Google Fonts) — золотой стандарт IDE-шрифта, знаком первокурсникам по VS Code
- **Loading:**
  - `https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap`
  - `https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap`
- **Scale:** hero 2.75rem / h2 1.5rem / body 1rem / label 0.7rem / code 0.855rem

## Color
- **Approach:** Restrained — один акцентный цвет, нейтральная палитра
- **Primary:** #2563eb — Tailwind blue-600, фирменный акцент; используется в кнопке, section-label
- **Secondary:** n/a
- **Neutrals:** #1a1a1a (основной текст) → #374151 (параграфы) → #6b7280 (подзаголовок хедера) → #e5e7eb (разделители)
- **Code block:** #1e1e2e фон (Catppuccin Mocha base) с полной палитрой токенов:
  - comments #6c7086 · keywords #cba6f7 · strings #a6e3a1 · functions #89b4fa
  - numbers #fab387 · operators #89dceb · punctuation #9399b2

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:** section padding 52px · header padding 56px/48px · pre padding 24px/28px · paragraph gap 16px

## Layout
- **Approach:** Grid-disciplined (single column)
- **Max content width:** 800px
- **Border radius:** code-inline 4px · pre 12px · button 7px · canvas 8px

## Motion
- **Approach:** Minimal-functional
- **Buttons:** transform scale(0.98) on :active — тактильный отклик без анимации
- **Duration:** 60ms active / 120ms hover transitions

## Syntax Highlighting
- **Library:** Prism.js v1.29.0 via cdnjs CDN
- **Language:** JavaScript (`class="language-javascript"` на всех `<code>` блоках)
- **Theme:** Custom Catppuccin Mocha (написан inline в `<style>`, подобран под существующий `#1e1e2e` фон кода)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-19 | Satoshi вместо system-ui для заголовков | system-ui сигналит "шрифт не выбирали"; Satoshi добавляет характер без потери читаемости |
| 2026-05-19 | Instrument Sans для body | Гуманистическая геометрия, отлично работает на длинных объяснениях |
| 2026-05-19 | JetBrains Mono + Prism.js | Первокурсники знают этот шрифт по VS Code; IDE-подсветка снижает когнитивную нагрузку при чтении кода |
| 2026-05-19 | Catppuccin Mocha как тема подсветки | Точно совпадает с существующим `#1e1e2e` фоном кода в проекте |
| 2026-05-19 | Сохранить существующую структуру | Одна колонка корректна для текстового образовательного контента |
