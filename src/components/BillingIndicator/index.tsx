interface IBillingIndicator {
  billed: number;
  limit?: number;
}

const DEFAULT_ANNUAL_LIMIT = 81000;

export function BillingIndicator({
  billed,
  limit = DEFAULT_ANNUAL_LIMIT,
}: IBillingIndicator) {
  const formattedMEILimit = limit.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  const percentAlreadyBilled = Number((billed / limit).toFixed(2));
  const formattedAlreadyBilled = billed.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <span className="flex items-center gap-2">
      <span>{`${formattedAlreadyBilled} de ${formattedMEILimit}`}</span>
      <span>{`(${percentAlreadyBilled * 100}%)`}</span>
      <div
        className={`w-4 h-4 rounded-full ${
          percentAlreadyBilled < 0.8 ? "bg-green-500" : "bg-red-500"
        }`}
      />
    </span>
  );
}
