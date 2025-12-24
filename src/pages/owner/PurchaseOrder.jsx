"use client"

import React, { useState } from "react"
import { Download, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function PurchaseOrdersPage() {
  const [poData, setPOData] = useState({
    vendor: "",
    poNumber: `PO-2024-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    issueDate: new Date().toISOString().split("T")[0],
    deliveryDate: "",
    items: [
      {
        id: 1,
        description: "PATCH WORK EXTERNAL CEMENT PLASTER",
        unit: "Sft",
        area: 100,
        rate: 90,
        amount: 9000,
      },
    ],
    totalAmount: 10620,
    approvedBy: "",
    status: "pending",
  })

  const [showPOApproval, setShowPOApproval] = useState(false)
  const [poApproved, setPOApproved] = useState(false)
  const [activePoTab, setActivePoTab] = useState("create")

  const purchaseOrders = [
    {
      id: "PO-2024-045",
      vendor: "ABC Suppliers",
      project: "Commercial Tower B",
      amount: 725000,
      status: "Pending",
      date: "2024-01-14",
    },
    {
      id: "PO-2024-046",
      vendor: "XYZ Materials",
      project: "Residential Complex A",
      amount: 550000,
      status: "Approved",
      date: "2024-01-12",
    },
  ]

  const handleApprovePO = () => {
    if (!poData.vendor || !poData.deliveryDate || !poData.approvedBy) {
      alert("Please fill all required fields")
      return
    }
    setPOApproved(true)
    setPOData({ ...poData, status: "approved" })
    setShowPOApproval(true)
  }

  const downloadPOPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("PURCHASE ORDER", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`PO Number: ${poData.poNumber}`, 20, 35)
    doc.text(`Issue Date: ${poData.issueDate}`, 20, 42)
    doc.text(`Delivery Date: ${poData.deliveryDate}`, 20, 49)

    doc.setFont("helvetica", "bold")
    doc.text("Vendor Details:", 20, 62)
    doc.setFont("helvetica", "normal")
    doc.text(`Vendor: ${poData.vendor}`, 20, 69)

    const tableData = poData.items.map((item, index) => [
      index + 1,
      item.description,
      item.unit,
      item.area,
      `₹${item.rate}`,
      `₹${item.amount.toLocaleString("en-IN")}`,
    ])

    autoTable(doc, {
      startY: 80,
      head: [["S.No", "Description", "Unit", "Quantity", "Rate", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [234, 88, 12] },
    })

    // Removed the (doc as any) TypeScript casting
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFont("helvetica", "bold")
    doc.text(`Total Amount: ₹${poData.totalAmount.toLocaleString("en-IN")}`, 140, finalY)
    doc.text(`Approved By: ${poData.approvedBy}`, 20, finalY + 10)
    doc.text(`Status: ${poData.status.toUpperCase()}`, 20, finalY + 17)

    doc.save(`PurchaseOrder-${poData.poNumber}.pdf`)
  }

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
    Purchase Orders
  </h2>

  <p className="text-gray-600">
    Manage purchase orders for materials and services
  </p>
</div>


      <Tabs value={activePoTab} onValueChange={setActivePoTab}>
        <TabsList>
          <TabsTrigger value="create">Create PO</TabsTrigger>
          <TabsTrigger value="history">PO History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Purchase Order</CardTitle>
              <CardDescription>Generate a new purchase order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">PO Number</label>
                  <Input value={poData.poNumber} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Vendor Name *</label>
                  <Input
                    placeholder="Enter vendor name"
                    value={poData.vendor}
                    onChange={(e) => setPOData({ ...poData, vendor: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Issue Date</label>
                  <Input type="date" value={poData.issueDate} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Delivery Date *</label>
                  <Input
                    type="date"
                    value={poData.deliveryDate}
                    onChange={(e) => setPOData({ ...poData, deliveryDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Approved By *</label>
                  <Input
                    placeholder="Enter approver name"
                    value={poData.approvedBy}
                    onChange={(e) => setPOData({ ...poData, approvedBy: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-2">
                  {poData.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded bg-white">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-xs text-gray-600">
                          {item.area} {item.unit} × ₹{item.rate} = ₹{item.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-right">
                  <p className="text-lg font-bold">Total Amount: ₹{poData.totalAmount.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button onClick={handleApprovePO} className="bg-orange-600 hover:bg-orange-700 text-white">
                Generate Purchase Order
              </Button>
              {poApproved && (
                <Button onClick={downloadPOPDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </CardFooter>
          </Card>

          {showPOApproval && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Purchase Order Generated Successfully!</p>
                    <p className="text-sm text-green-700">PO Number: {poData.poNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Order History</CardTitle>
              <CardDescription>View all purchase orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchaseOrders.map((po) => (
                  <div key={po.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded hover:bg-gray-50 gap-4">
                    <div className="flex-1">
                      <p className="font-semibold">{po.id}</p>
                      <p className="text-sm text-gray-600">{po.vendor}</p>
                      <p className="text-xs text-gray-500">{po.project}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">₹{po.amount.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-gray-500">{po.date}</p>
                    </div>
                    <div>
                      {po.status === "Approved" ? (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">Approved</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}