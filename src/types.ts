// https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript/52473108#52473108
export type IfEquals<X, Y, A = X, B = never> = 
  (<T>() => T extends X ? 1 : 2) extends 
  (<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

export type PickWritable<T> = { [K in WritableKeys<T>]: T[K] };