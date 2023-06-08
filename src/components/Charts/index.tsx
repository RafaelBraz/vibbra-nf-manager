import type { CategoryType } from "@/types/category,type";
import type { ExpenseType } from "@/types/expense.type";
import type { InvoiceType } from "@/types/invoice.type";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import dayjs from "dayjs";
import ChartJS from "chart.js/auto";
import { Chart, Bar } from "react-chartjs-2";
import { fetcher } from "@/lib/swr/fetcher";
import { useState } from "react";

ChartJS.register();

type InvoicesSWRDataType = {
  invoices: InvoiceType[];
};
type ExpensesSWRDataType = {
  expenses: ExpenseType[];
};
type CategoriesSWRDataType = {
  categories: CategoryType[];
};

export function Charts() {
  const { data: session } = useSession();
  const user = session?.user;
  const [yearFilter, setYearFilter] = useState(dayjs().year());

  const invoicesQuery = useSWR<InvoicesSWRDataType>(
    `/api/invoices/${user?.id ?? ""}`,
    fetcher
  );

  const expensesQuery = useSWR<ExpensesSWRDataType>(
    `/api/expenses/${user?.id ?? ""}`,
    fetcher
  );

  const categoriesQuery = useSWR<CategoriesSWRDataType>(
    `/api/categories/${user?.id ?? ""}`,
    fetcher
  );

  if (
    invoicesQuery.isLoading ||
    expensesQuery.isLoading ||
    categoriesQuery.isLoading
  ) {
    return <p>Loading...</p>;
  }

  if (invoicesQuery.error) {
    return <p>Erro ao carregar notas fiscais</p>;
  }

  if (expensesQuery.error) {
    return <p>Erro ao carregar despesas</p>;
  }

  if (categoriesQuery.error) {
    return <p>Erro ao carregar categorias</p>;
  }

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const invoices = invoicesQuery.data?.invoices ?? [];
  const expenses = expensesQuery.data?.expenses ?? [];
  const categories = categoriesQuery.data?.categories ?? [];

  const invoicePerMonthDataset = invoices
    .filter(
      (invoice) => dayjs(invoice.paymentIn.split("T")[0]).year() === yearFilter
    )
    .reduce(
      (sum, invoice) => {
        const month = dayjs(invoice.paymentIn.split("T")[0]).month();
        return sum.map((value, i) => {
          if (month === i) return value + invoice.value;
          return value;
        });
      },
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );

  const expensesPerMonthDataset = expenses
    .filter(
      (expense) => dayjs(expense.paymentIn.split("T")[0]).year() === yearFilter
    )
    .reduce(
      (sum, expense) => {
        const month = dayjs(expense.paymentIn.split("T")[0]).month();
        return sum.map((value, i) => {
          if (month === i) return value + expense.value;
          return value;
        });
      },
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );

  const categoriesLabels = categories.map((category) => category.name);
  const expensesPerCategoryDataset = expenses
    .filter(
      (expense) => dayjs(expense.paymentIn.split("T")[0]).year() === yearFilter
    )
    .reduce(
      (sum, expense) => {
        const category = categories.find(({ id }) => expense.categoryId === id);

        if (!category) return sum;

        const categoryIndex = categoriesLabels.findIndex(
          (name) => name === category.name
        );

        return sum.map((value, i) => {
          if (categoryIndex === i) return value + expense.value;
          return value;
        });
      },
      [...new Array(categories.length).fill(0)]
    );

  const balancePerMonthDataset = [
    expensesPerMonthDataset,
    invoicePerMonthDataset,
  ].reduce((prev, current) => prev.map((value, i) => current[i] - value));

  const invoicesData = {
    labels: months,
    datasets: [
      {
        label: "Valores recebido (R$)",
        data: invoicePerMonthDataset,
        backgroundColor: "rgba(25, 84, 46, 1)",
      },
    ],
  };

  const expensesData = {
    labels: months,
    datasets: [
      {
        label: "Despesas (R$)",
        data: expensesPerMonthDataset,
        backgroundColor: "rgba(89, 30, 96, 1)",
      },
    ],
  };

  const balanceData = {
    labels: months,
    datasets: [
      {
        type: "line" as const,
        label: "Balanço (R$)",
        data: balancePerMonthDataset,
        borderColor: "rgba(168, 168, 22, 1)",
        borderWidth: 2,
        backgroundColor: "rgba(168, 168, 22, 1)",
      },
      {
        type: "bar" as const,
        label: "Ganhos (R$)",
        data: invoicePerMonthDataset,
        backgroundColor: "rgba(25, 84, 46, 1)",
      },
      {
        type: "bar" as const,
        label: "Gastos (R$)",
        data: expensesPerMonthDataset,
        backgroundColor: "rgba(89, 30, 96, 1)",
      },
    ],
  };

  const categoriesData = {
    labels: categoriesLabels,
    datasets: [
      {
        label: "Gastos (R$)",
        data: expensesPerCategoryDataset,
        backgroundColor: "rgba(89, 30, 96, 1)",
      },
    ],
  };

  return (
    <div className="w-full flex flex-col gap-12">
      <label className="ml-auto flex gap-2">
        Ano:
        <select
          className="border-2 border-zinc-500"
          value={yearFilter}
          onChange={(e) => setYearFilter(Number(e.target.value))}
        >
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </label>

      <div className="p-4 flex flex-col gap-2 bg-zinc-100 rounded-md">
        <h6>Valores recebidos (mês a mês)</h6>
        <p className="text-zinc-500 text-xs">
          Obs.: Está sendo considerado o mês de recebimento da nota, e não o de
          competência
        </p>

        <Bar data={invoicesData} height={75} />
      </div>

      <div className="p-4 flex flex-col gap-2 bg-zinc-100 rounded-md">
        <h6>Valores de despesas (mês a mês)</h6>
        <p className="text-zinc-500 text-xs">
          Obs.: Está sendo considerado o mês de pagamento da despesa, e não o de
          competência
        </p>

        <Bar data={expensesData} height={75} />
      </div>

      <div className="p-4 flex flex-col gap-2 bg-zinc-100 rounded-md">
        <h6>Balanço simples (mês a mês)</h6>

        <Chart type={"bar"} data={balanceData} height={75} />
      </div>

      <div className="p-4 flex flex-col gap-2 bg-zinc-100 rounded-md">
        <h6>Valores de Despesas (por categoria)</h6>
        <p className="text-zinc-500 text-xs">
          Obs.: Categorias arquivadas também estão inclusas
        </p>

        <Bar data={categoriesData} height={75} />
      </div>
    </div>
  );
}
