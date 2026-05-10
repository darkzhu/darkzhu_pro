const petals = Array.from({ length: 18 }, (_, index) => index);

export function SakuraFall() {
  return (
    <div className="sakura-fall" aria-hidden="true">
      {petals.map((petal) => (
        <span key={petal} className="sakura-petal" />
      ))}
    </div>
  );
}
