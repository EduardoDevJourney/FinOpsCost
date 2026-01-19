// src/components/Tags/TagsExplorer.tsx
import { useMemo, useState } from "react";
import DataTable from "../Table/DataTable";
import type { Column } from "../Table/DataTable";

type TagReport = {
  tag: string;
  value: string;
  resourceCount: number;
  cost: number;
  subscriptionName: string;
};

type Props = {
  data: TagReport[];
};

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function TagsExplorer({ data }: Props) {
  // ----- filtros/ordenação -----
  const [query, setQuery] = useState("");
  const [tagKey, setTagKey] = useState<string>("");
  const [tagValue, setTagValue] = useState<string>("");
  const [subscription, setSubscription] = useState<string>("");
  const [sortBy, setSortBy] = useState<"resourceCount" | "cost">("cost");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  // opções únicas para Tag, Value e Subscription
  const tagOptions = useMemo(() => {
    const s = new Set<string>();
    data.forEach((d) => s.add(d.tag));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const subscriptionOptions = useMemo(() => {
    const s = new Set<string>();
    data.forEach((d) => s.add(d.subscriptionName));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [data]);

  // aplica filtros + ordenação
  const filtered = useMemo(() => {
    let rows = [...data];

    // filtro por subscription
    if (subscription)
      rows = rows.filter((r) => r.subscriptionName === subscription);

    // filtro por tag
    if (tagKey) rows = rows.filter((r) => r.tag === tagKey);

    // filtro por value (dependente da tag)
    if (tagValue) rows = rows.filter((r) => r.value === tagValue);

    // busca livre (em tag, value OU subscription)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.tag.toLowerCase().includes(q) ||
          r.value.toLowerCase().includes(q) ||
          r.subscriptionName.toLowerCase().includes(q)
      );
    }

    // ordenação
    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const va = sortBy === "cost" ? a.cost : a.resourceCount;
      const vb = sortBy === "cost" ? b.cost : b.resourceCount;
      if (va === vb) return 0;
      return va > vb ? dir : -dir;
    });

    return rows;
  }, [data, subscription, tagKey, tagValue, query, sortBy, sortDir]);

  // colunas da tabela
  const columns: Column<TagReport>[] = [
    { header: "Subscription", accessor: "subscriptionName", width: "25%" },
    { header: "Tags", accessor: "tag", width: "25%" },
    { header: "Value", accessor: "value", width: "25%" },
    { header: "Resources", accessor: "resourceCount", width: "12%" },
    {
      header: "Cost",
      accessor: (row) => <span>{brl.format(row.cost)}</span>,
      width: "13%",
    },
  ];

  const clearAll = () => {
    setQuery("");
    setTagKey("");
    setTagValue("");
    setSubscription("");
    setSortBy("cost");
    setSortDir("desc");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-800">Tags Explorer</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-4 space-y-3">
        {/* Primeira linha de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <label className="block text-xs text-gray-500 mb-1">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in Subscription, Tag or Value"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs text-gray-500 mb-1">
              Subscription
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
            >
              <option value="">All Subscriptions</option>
              {subscriptionOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs text-gray-500 mb-1">Tag</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={tagKey}
              onChange={(e) => {
                setTagKey(e.target.value);
                setTagValue(""); // reset value ao trocar a tag
              }}
            >
              <option value="">All Tags</option>
              {tagOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Segunda linha de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3">
            <label className="block text-xs text-gray-500 mb-1">Sort by</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "resourceCount" | "cost")
              }
            >
              <option value="cost">Cost</option>
              <option value="resourceCount">Resource Count</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Order</label>
            <button
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              title="Toggle ascending/descending"
            >
              {sortDir === "asc" ? "ASC ↑" : "DESC ↓"}
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Actions</label>
            <button
              onClick={clearAll}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs text-gray-500 mb-1">Results</label>
            <div className="text-sm text-gray-600 py-2">
              Showing {filtered.length} of {data.length} tag reports
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="mt-3">
        <DataTable<TagReport> columns={columns} data={filtered} />
      </div>
    </div>
  );
}
