import { useNavigate } from "react-router-dom";
import {
  FileText,
  ShoppingCart,
  Truck,
  Receipt
} from "lucide-react";

const PaperCard = ({ title, desc, icon: Icon, path, color }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-800 group-hover:text-blue-600">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {desc}
      </p>

      <div className="mt-4 text-sm font-bold text-blue-600">
        Open →
      </div>
    </div>
  );
};

export default function Paperwork() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Paperwork & Billing
        </h1>
        <p className="text-slate-500 font-medium">
          Manage all financial & compliance documents from one place
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <PaperCard
          title="Quotation"
          desc="Prepare cost estimates and client quotations"
          icon={FileText}
          path="/owner/docs/quotation"
          color="bg-blue-50 text-blue-600"
        />

        <PaperCard
          title="Purchase Order"
          desc="Approve and issue official purchase orders"
          icon={ShoppingCart}
          path="/owner/docs/purchase-order"
          color="bg-emerald-50 text-emerald-600"
        />

        <PaperCard
          title="Material Order"
          desc="Convert approved requests into orders"
          icon={Truck}
          path="/owner/docs/material-order"
          color="bg-amber-50 text-amber-600"
        />

        <PaperCard
          title="GST Invoice"
          desc="Generate GST-compliant invoices for billing"
          icon={Receipt}
          path="/owner/docs/gst-invoice"
          color="bg-indigo-50 text-indigo-600"
        />

      </div>
    </div>
  );
}
