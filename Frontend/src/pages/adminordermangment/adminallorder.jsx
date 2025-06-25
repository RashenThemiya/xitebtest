import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const AllOrdersAdmin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/admin/prescriptions");
        setOrders(res.data.prescriptions);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      const matchesGlobalFilter = globalFilter
        ? Object.values(order).some((value) =>
            String(value).toLowerCase().includes(globalFilter.toLowerCase())
          )
        : true;
      return matchesStatus && matchesGlobalFilter;
    });
  }, [orders, statusFilter, globalFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: (info) => {
          const id = info.getValue();
          return (
            <button
              className="text-teal-600 hover:underline text-sm"
              onClick={() => navigate(`/admin/orders/${id}`)}
            >
              #{id}
            </button>
          );
        },
      },
      {
        accessorKey: "user.name",
        header: "Customer Name",
        cell: (info) => <span className="text-sm">{info.getValue() || "-"}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <span className="capitalize text-sm font-medium text-gray-700">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "delivery_address",
        header: "Address",
        cell: (info) => <span className="text-sm">{info.getValue() || "-"}</span>,
      },
      {
        accessorKey: "delivery_time",
        header: "Delivery Time",
        cell: (info) => (
          <span className="text-sm">
            {info.getValue() ? new Date(info.getValue()).toLocaleString() : "-"}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: (info) => (
          <span className="text-sm">
            {new Date(info.getValue()).toLocaleString()}
          </span>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-6xl p-8">
        <div className="flex justify-between items-center mb-6">
          <button
  onClick={() => navigate("/order-management")}
  className="fixed bottom-6 right-6 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200 z-50"
>
  Back to Management
</button>

          <h2 className="text-3xl font-bold text-gray-800">All Orders (Admin)</h2>
          <span className="text-sm text-gray-500">Admin: {name}</span>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {["", "pending", "quotationed", "approved", "delivery", "delivered"].map(
            (status) => (
              <button
                key={status || "all"}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1 rounded-full border ${
                  statusFilter === status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-100"
                } transition`}
              >
                {status === ""
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>

        <input
          type="text"
          placeholder="Search orders..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="mb-6 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-700"
        />

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">No orders available.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full border">
                <thead className="bg-teal-600 text-white">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-sm font-medium"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default AllOrdersAdmin;
