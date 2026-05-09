export type ExampleKey = 'hello' | 'loop' | 'list' | 'func' | 'math';

export const EXAMPLES: Record<ExampleKey, string> = {
  hello: `functia main():
    drukuvaty "Привіт, світе!"
    drukuvaty "Hello from Piton WASM"

main()`,

  loop: `functia main():
    i = 0
    poky i < 6:
        drukuvaty i
        i = i + 1

main()`,

  list: `functia main():
    a = [1, 2, 3]
    b = dodaty(a, [4, 5])
    drukuvaty b
    drukuvaty "dovzhyna:"
    drukuvaty dovzhyna(b)

main()`,

  func: `functia kvadrat(x):
    vernuty x * x

functia klasify(n):
    yaksho n > 50:
        vernuty "велике"
    inackshe yaksho n > 10:
        vernuty "середнє"
    inackshe:
        vernuty "мале"

functia main():
    n = 7
    drukuvaty kvadrat(n)
    drukuvaty klasify(n)
    drukuvaty klasify(72)

main()`,

  math: `functia main():
    drukuvaty "korin(16):"
    drukuvaty korin(16)
    drukuvaty "2 stupin 10:"
    drukuvaty 2 stupin 10
    drukuvaty "kosynus(0):"
    drukuvaty kosynus(0)

main()`
};

export const KEYWORDS = [
  'yaksho',
  'inackshe',
  'poky',
  'functia',
  'vernuty',
  'drukuvaty',
  'dovzhyna',
  'dodaty',
  'abs',
  'korin',
  'stupin',
  'kosynus',
  'synus',
  'tangent',
  'loh10',
  'vypadkovo',
  'chas',
  'zatrymka',
  'zaokruhlennya',
  'kolor',
  'slovnyk',
  'delete',
  'vykorystaty',
  'ne',
  'ta',
  'abo',
  'true',
  'false'
];
