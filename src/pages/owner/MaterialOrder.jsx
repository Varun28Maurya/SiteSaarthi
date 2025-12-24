"use client"

import React, { useState } from "react"
import { FileText, Download, ArrowLeft } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* ================= MATERIAL ORDER ONLY ================= */

export default function MaterialOrderDocuments() {
  const [filter, setFilter] = useState({
  search: "",
  status: "all",
  date: "",
})

  const materialOrders = [
    {
      id: "MO-001",
      project: "Residential Complex A",
      amount: 225000,
      status: "Approved",
      date: "2024-01-15",
    },
    {
      id: "MO-002",
      project: "Commercial Tower B",
      amount: 180000,
      status: "Pending",
      date: "2024-01-18",
    },
  ]

  /* ================= FILTER LOGIC ================= */

  const filteredOrders = materialOrders.filter((mo) => {
    if (
      filter.search &&
      !mo.id.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false

    if (filter.status !== "all" && mo.status !== filter.status) return false
    if (filter.date && mo.date !== filter.date) return false

    return true
  })

  /* ================= PDF GENERATOR ================= */

  const downloadMaterialOrderPDF = (order) => {
  const pdf = new jsPDF()

  /* ===== HEADER ===== */
  pdf.setFontSize(18)
  pdf.setFont("helvetica", "bold")
  pdf.text("MATERIAL ORDER", 105, 20, { align: "center" })

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")

  pdf.text(`Material Order ID: ${order.id}`, 20, 40)
  pdf.text(`Project Name: ${order.project}`, 20, 48)
  pdf.text(`Status: ${order.status}`, 20, 56)
  pdf.text(`Order Date: ${order.date}`, 20, 64)

  pdf.line(20, 70, 190, 70)

  /* ===== MATERIAL ITEMS (3 ITEMS) ===== */
  const items = [
    {
      name: "Cement OPC 53 Grade",
      unit: "Bags",
      qty: 500,
      rate: 450,
    },
    {
      name: "TMT Steel Bars 12mm",
      unit: "Tons",
      qty: 2,
      rate: 65000,
    },
    {
      name: "River Sand",
      unit: "Tons",
      qty: 5,
      rate: 1800,
    },
  ]

  const tableBody = items.map((item, index) => {
    const amount = item.qty * item.rate
    return [
      index + 1,
      item.name,
      item.unit,
      item.qty,
      `₹${item.rate.toLocaleString("en-IN")}`,
      `₹${amount.toLocaleString("en-IN")}`,
    ]
  })

  const totalAmount = items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0,
  )

  /* ===== TABLE ===== */
  autoTable(pdf, {
    startY: 80,
    head: [
      [
        "S.No",
        "Material Name",
        "Unit",
        "Quantity",
        "Rate",
        "Amount",
      ],
    ],
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: [234, 88, 12],
      textColor: 255,
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
    },
  })

  /* ===== TOTAL  ===== */
  const finalY = pdf.lastAutoTable.finalY + 8

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(11)
  pdf.text("Total Material Value :", 120, finalY)
  pdf.text(
    `₹${totalAmount.toLocaleString("en-IN")}`,
    190,
    finalY,
    { align: "right" },
  )

  /* ===== FOOTER ===== */
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "normal")
  pdf.text(
    "This material order is digitally generated and approved.",
    20,
    finalY + 15,
  )

  pdf.text(
    `Generated On: ${new Date().toLocaleDateString("en-IN")}`,
    20,
    finalY + 22,
  )

  pdf.save(`MaterialOrder-${order.id}.pdf`)
}

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
  {/* Back */}
  <button
    onClick={() => window.history.back()}
    className="flex items-center gap-1 text-sm font-medium text-gray-700 w-fit -ml-1 hover:text-black transition"
  >
    <ArrowLeft className="h-5 w-5" />
    Back
  </button>

  <h2 className="text-3xl font-bold leading-tight">
    Material Orders
  </h2>

  <p className="text-gray-600">
    View and download material order documents
  </p>
</div>

      <Card>
        <CardHeader>
          <CardTitle>Material Order History</CardTitle>
          <CardDescription>
            Filter & download material order PDFs
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="Search Order ID"
              value={filter.search}
              onChange={(e) =>
                setFilter({ ...filter, search: e.target.value })
              }
            />

            <Input
  type="date"
  value={filter.date}
  onChange={(e) =>
    setFilter({ ...filter, date: e.target.value })
  }
/>

            <Select
              value={filter.status}
              onValueChange={(value) =>
                setFilter({ ...filter, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded gap-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.project}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        order.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadMaterialOrderPDF(order)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <p className="text-center py-10 text-gray-500">
                No material orders found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
