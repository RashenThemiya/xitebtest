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

const ViewOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { name, role } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/prescriptions");
        setOrders(response.data.prescriptions);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on statusFilter and globalFilter
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
              onClick={() => navigate(`/prescriptions/${id}/summary`)}
            >
              #{id}
            </button>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => <span className="capitalize text-sm">{info.getValue()}</span>,
      },
      {
        accessorKey: "note",
        header: "Note",
        cell: (info) => <span className="text-sm">{info.getValue() || "-"}</span>,
      },
      {
        accessorKey: "delivery_address",
        header: "Delivery Address",
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
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 relative">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          View All Orders
        </h2>

        {/* Status Filter Tabs */}
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {["", "pending", "quotationed", "approved", "delivery", "delivered"].map(
            (status) => (
              <button
                key={status || "all"}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1 rounded-full border transition ${
                  statusFilter === status
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-100"
                }`}
              >
                {status === ""
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by status, note, or address"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No orders found.</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full">
                <thead className="bg-teal-600 text-white">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-sm font-medium"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/order-management")}
        className="fixed bottom-8 right-8 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200"
      >
        Back to Management
      </button>
    </div>
  );
};

export default ViewOrders;
