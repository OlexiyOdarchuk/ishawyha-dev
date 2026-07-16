<!--
  Фон: базовий колір + дуже тонка крапко-сітка по всій висоті (щоб білі картки
  «плавали», а не лежали на пласкому папері) + делікатні тоновані світіння
  індиго/sky, розкидані по краях згори й знизу. Усе статичне, нуль CPU.
-->
<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
  <div class="absolute inset-0" style="background: var(--color-bg);"></div>

  <!-- ледь помітна крапко-сітка (додає «текстуру дизайну» без шуму) -->
  <div
    class="bg-dots absolute inset-0"
    style="background-image: radial-gradient(var(--dot-color) 1px, transparent 1px); background-size: 22px 22px;"
  ></div>

  <!-- м'які світіння по краях -->
  <div
    class="absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl"
    style="background: radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 65%);"
  ></div>
  <div
    class="absolute -top-20 right-[-12rem] h-[32rem] w-[32rem] rounded-full opacity-60 blur-3xl"
    style="background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 65%);"
  ></div>
  <div
    class="absolute bottom-[-14rem] left-[8%] h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
    style="background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%);"
  ></div>
</div>

<style>
  .bg-dots {
    --dot-color: rgba(15, 23, 42, 0.05);
    -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5));
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5));
  }
  :global(.dark) .bg-dots {
    --dot-color: rgba(148, 163, 184, 0.07);
  }
</style>
