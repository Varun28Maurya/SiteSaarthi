"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function GSTInvoicePage() {
  const navigate = useNavigate()
  const [gstInvoiceData, setGstInvoiceData] = useState({
    companyName: "ConstructPro Private Limited",
    companyGSTIN: "29ABCDE1234F1Z5",
    companyAddress: "123, MG Road, Bengaluru, Karnataka - 560001",
    clientName: "",
    clientGSTIN: "",
    clientAddress: "",
    invoiceNumber: `GST-2024-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    hsnCode: "9954",
    placeOfSupply: "Karnataka",
  })

  const [showGSTInvoice, setShowGSTInvoice] = useState(false)
  const [gstInvoiceGenerated, setGSTInvoiceGenerated] = useState(false)

  const items = [
    {
      id: 1,
      description: "PATCH WORK EXTERNAL CEMENT PLASTER",
      unit: "Sft",
      area: 100,
      rate: 90,
      amount: 9000,
    },
  ]

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const total = subtotal + (subtotal * 18) / 100

  const gstInvoices = [
    {
      id: "GST-2024-101",
      client: "Abhilasa Tower",
      project: "Residential Complex A",
      amount: 890000,
      gst: 160200,
      total: 1050200,
      status: "Paid",
      date: "2024-01-10",
    },
    {
      id: "GST-2024-102",
      client: "Tech Park Ltd",
      project: "Commercial Tower B",
      amount: 1250000,
      gst: 225000,
      total: 1475000,
      status: "Pending",
      date: "2024-01-08",
    },
  ]

  const handleGenerateGSTInvoice = () => {
    if (!gstInvoiceData.clientName || !gstInvoiceData.clientGSTIN || !gstInvoiceData.clientAddress) {
      alert("Please fill all required client details")
      return
    }
    setShowGSTInvoice(true)
    setGSTInvoiceGenerated(true)
  }

  const downloadGSTInvoicePDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("TAX INVOICE", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(gstInvoiceData.companyName, 20, 35)
    doc.setFont("helvetica", "normal")
    doc.text(`GSTIN: ${gstInvoiceData.companyGSTIN}`, 20, 42)
    doc.text(gstInvoiceData.companyAddress, 20, 49, { maxWidth: 80 })

    doc.text(`Invoice No: ${gstInvoiceData.invoiceNumber}`, 130, 35)
    doc.text(`Date: ${gstInvoiceData.invoiceDate}`, 130, 42)

    doc.setFont("helvetica", "bold")
    doc.text("Bill To:", 20, 65)
    doc.setFont("helvetica", "normal")
    doc.text(gstInvoiceData.clientName, 20, 72)
    doc.text(`GSTIN: ${gstInvoiceData.clientGSTIN}`, 20, 79)
    doc.text(gstInvoiceData.clientAddress, 20, 86, { maxWidth: 80 })

    const tableData = items.map((item, index) => [
      index + 1,
      item.description,
      gstInvoiceData.hsnCode,
      item.unit,
      item.area,
      `₹${item.rate}`,
      `₹${item.amount.toLocaleString("en-IN")}`,
    ])

    autoTable(doc, {
      startY: 100,
      head: [["S.No", "Description", "HSN/SAC", "Unit", "Qty", "Rate", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [234, 88, 12] },
    })

    // Removed the (doc as any) type casting
    const finalY = doc.lastAutoTable.finalY + 10
    doc.text(`Subtotal: ₹${subtotal.toLocaleString("en-IN")}`, 140, finalY)

    if (gstInvoiceData.placeOfSupply === "Karnataka") {
      doc.text(`CGST (9%): ₹${((subtotal * 9) / 100).toLocaleString("en-IN")}`, 140, finalY + 7)
      doc.text(`SGST (9%): ₹${((subtotal * 9) / 100).toLocaleString("en-IN")}`, 140, finalY + 14)
    } else {
      doc.text(`IGST (18%): ₹${((subtotal * 18) / 100).toLocaleString("en-IN")}`, 140, finalY + 7)
    }

    doc.setFont("helvetica", "bold")
    doc.text(`Total: ₹${total.toLocaleString("en-IN")}`, 140, finalY + 21)

    doc.save(`GST-Invoice-${gstInvoiceData.invoiceNumber}.pdf`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
  {/* Back */}
  <button
    onClick={() => navigate("/owner/docs")}
    className="flex items-center gap-1 text-sm font-medium text-gray-700 w-fit -ml-1 hover:text-black transition"
    aria-label="Go back"
  >
    <ArrowLeft className="h-5 w-5" />
    Back
  </button>

  {/* Title */}
  <h2 className="text-3xl font-bold leading-tight">
    GST Invoice
  </h2>

  <p className="text-gray-600">
    Generate GST compliant tax invoices
  </p>
</div>




      <Card>
        <CardHeader>
          <CardTitle>Create GST Invoice</CardTitle>
          <CardDescription>Generate tax invoice with GST details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Invoice Number</label>
              <Input value={gstInvoiceData.invoiceNumber} readOnly className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Invoice Date</label>
              <Input type="date" value={gstInvoiceData.invoiceDate} readOnly className="mt-1" />
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Company Name</p>
                <p className="font-medium">{gstInvoiceData.companyName}</p>
              </div>
              <div>
                <p className="text-gray-600">GSTIN</p>
                <p className="font-medium">{gstInvoiceData.companyGSTIN}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{gstInvoiceData.companyAddress}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Client Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Client Name *</label>
                <Input
                  placeholder="Enter client name"
                  value={gstInvoiceData.clientName}
                  onChange={(e) => setGstInvoiceData({ ...gstInvoiceData, clientName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Client GSTIN *</label>
                <Input
                  placeholder="Enter GSTIN"
                  value={gstInvoiceData.clientGSTIN}
                  onChange={(e) => setGstInvoiceData({ ...gstInvoiceData, clientGSTIN: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Client Address *</label>
                <Input
                  placeholder="Enter client address"
                  value={gstInvoiceData.clientAddress}
                  onChange={(e) => setGstInvoiceData({ ...gstInvoiceData, clientAddress: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Place of Supply</label>
                <Select
                  value={gstInvoiceData.placeOfSupply}
                  onValueChange={(value) => setGstInvoiceData({ ...gstInvoiceData, placeOfSupply: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Karnataka">Karnataka (CGST + SGST)</SelectItem>
                    <SelectItem value="Other">Other State (IGST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Invoice Items</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs text-gray-600">
                      HSN: {gstInvoiceData.hsnCode} | {item.area} {item.unit} × ₹{item.rate}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.amount.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {gstInvoiceData.placeOfSupply === "Karnataka" ? (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">CGST (9%):</span>
                    <span>₹{((subtotal * 9) / 100).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">SGST (9%):</span>
                    <span>₹{((subtotal * 9) / 100).toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="font-medium">IGST (18%):</span>
                  <span>₹{((subtotal * 18) / 100).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={handleGenerateGSTInvoice} className="bg-orange-600 hover:bg-orange-700">
            Generate GST Invoice
          </Button>
          {gstInvoiceGenerated && (
            <Button onClick={downloadGSTInvoicePDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </CardFooter>
      </Card>

      {showGSTInvoice && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">GST Invoice Generated Successfully!</p>
                <p className="text-sm text-green-700">Invoice Number: {gstInvoiceData.invoiceNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>GST Invoice History</CardTitle>
          <CardDescription>View all generated GST invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gstInvoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{invoice.id}</p>
                  <p className="text-sm text-gray-600">{invoice.client}</p>
                  <p className="text-xs text-gray-500">{invoice.project}</p>
                </div>
                <div className="flex flex-col sm:items-end w-full sm:w-auto">
                  <p className="font-semibold">₹{invoice.total.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-500">GST: ₹{invoice.gst.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-500">{invoice.date}</p>
                </div>
                <div>
                  {invoice.status === "Paid" && (
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>
                  )}
                  {invoice.status === "Pending" && (
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}