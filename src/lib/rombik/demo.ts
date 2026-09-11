// Заготовлені приклади rombik: код + готова анімована схема (GIF з rombik CLI).
// Вихід Go-рушія rombik; демо саме рушій НЕ вантажить. Щоб спробувати на своєму коді — rombik.app.
// Перегенерувати: rombik render <file> -f gif_anim --locale uk --lang <lang> -o static/rombik/<key>.gif
// (GIF у 2× — w/h тут = половина пікселів, щоб на retina було чітко).
// Далі вирізати з файлу блок NETSCAPE2.0 (21 FF 0B "NETSCAPE2.0" 03 01 xx xx 00): без нього GIF
// грає один раз і лишається готовою схемою; повтор — кнопкою «Побудувати знову».
// Після зміни GIF підняти ?v=N у gif (CDN і браузер кешують їх на години).
export type RombikLang = 'python' | 'c' | 'cpp' | 'csharp' | 'java' | 'pascal';
export type RombikDemo = {
  key: string;
  label: string;
  lang: RombikLang;
  code: string;
  gif: string;
  w: number;
  h: number;
};

export const DEMOS: RombikDemo[] = [
  {
    key: "grade",
    label: "Оцінка · Python · if / elif / else",
    lang: "python",
    code: "def grade(score):\n    if score >= 90:\n        print(\"Відмінно\")\n    elif score >= 60:\n        print(\"Задовільно\")\n    else:\n        print(\"Незадовільно\")",
    gif: "/rombik/grade.gif?v=2",
    w: 444,
    h: 898
  },
  {
    key: "suma",
    label: "Сума · Python · цикл for",
    lang: "python",
    code: "def suma(n):\n    s = 0\n    for i in range(1, n + 1):\n        s = s + i\n    return s",
    gif: "/rombik/suma.gif?v=2",
    w: 344,
    h: 744
  },
  {
    key: "factorial",
    label: "Факторіал · Python · while",
    lang: "python",
    code: "def factorial(n):\n    result = 1\n    while n > 1:\n        result = result * n\n        n = n - 1\n    return result",
    gif: "/rombik/factorial.gif?v=2",
    w: 314,
    h: 860
  },
  {
    key: "bubble",
    label: "Сортування · C++ · вкладені цикли",
    lang: "cpp",
    code: "void bubble_sort(int a[], int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (a[j] > a[j + 1]) {\n                int t = a[j];\n                a[j] = a[j + 1];\n                a[j + 1] = t;\n            }\n        }\n    }\n}",
    gif: "/rombik/bubble.gif?v=2",
    w: 425,
    h: 1028
  },
  {
    key: "prime",
    label: "Просте число · Pascal · for + return",
    lang: "pascal",
    code: "function is_prime(n: integer): boolean;\nvar\n  i: integer;\nbegin\n  if n < 2 then\n  begin\n    is_prime := false;\n    exit;\n  end;\n  for i := 2 to n - 1 do\n  begin\n    if n mod i = 0 then\n    begin\n      is_prime := false;\n      exit;\n    end;\n  end;\n  is_prime := true;\nend;",
    gif: "/rombik/prime.gif?v=2",
    w: 380,
    h: 1388
  },
  {
    key: "gcd",
    label: "НСД · Python · алгоритм Евкліда",
    lang: "python",
    code: "def gcd(a, b):\n    while b != 0:\n        t = b\n        b = a % b\n        a = t\n    return a",
    gif: "/rombik/gcd.gif?v=2",
    w: 314,
    h: 860
  },
];
