"use client"

import React, { useState } from "react"
import { Plus, Trash2, Download, ArrowLeft} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function QuotationPage() {
  const [quotationData, setQuotationData] = useState({
    projectName: "Residential Complex A",
    clientName: "Abhilasa Tower",
    items: [
      {
        id: 1,
        description: "PATCH WORK EXTERNAL CEMENT PLASTER",
        fullDescription: "Cement plaster work with Dr. Fixit Pidiproof",
        unit: "Sft",
        area: 100,
        rate: 90,
        amount: 9000,
      },
    ],
    subtotal: 9000,
    gst: 18,
    total: 10620,
  })

  const [generatedQuotation, setGeneratedQuotation] = useState(null)

  const addQuotationItem = () => {
    const newItem = {
      id: Date.now(), // Using timestamp for unique IDs
      description: "",
      fullDescription: "",
      unit: "Sft",
      area: 0,
      rate: 0,
      amount: 0,
    }
    setQuotationData({
      ...quotationData,
      items: [...quotationData.items, newItem],
    })
  }

  const deleteQuotationItem = (itemId) => {
    const updatedItems = quotationData.items.filter((item) => item.id !== itemId)
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const newTotal = newSubtotal + (newSubtotal * quotationData.gst) / 100

    setQuotationData({
      ...quotationData,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal,
    })
  }

  const updateQuotationItem = (itemId, field, value) => {
    const updatedItems = quotationData.items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        if (field === "area" || field === "rate") {
          updatedItem.amount = (updatedItem.area || 0) * (updatedItem.rate || 0)
        }
        return updatedItem
      }
      return item
    })

    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    const newTotal = newSubtotal + (newSubtotal * quotationData.gst) / 100

    setQuotationData({
      ...quotationData,
      items: updatedItems,
      subtotal: newSubtotal,
      total: newTotal,
    })
  }

  const generateQuotation = () => {
    const calculatedSubtotal = quotationData.items.reduce((sum, item) => sum + item.amount, 0)
    const calculatedTotal = calculatedSubtotal + (calculatedSubtotal * quotationData.gst) / 100

    setGeneratedQuotation({
      ...quotationData,
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      quotationNumber: `QT-2024-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      date: new Date().toLocaleDateString("en-IN"),
    })
  }

  const downloadQuotationPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("QUOTATION", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Quotation No: ${generatedQuotation.quotationNumber}`, 20, 35)
    doc.text(`Date: ${generatedQuotation.date}`, 20, 42)

    doc.setFont("helvetica", "bold")
    doc.text("Project Details:", 20, 55)
    doc.setFont("helvetica", "normal")
    doc.text(`Project: ${generatedQuotation.projectName}`, 20, 62)
    doc.text(`Client: ${generatedQuotation.clientName}`, 20, 69)

    const tableData = generatedQuotation.items.map((item, index) => [
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

    const finalY = doc.lastAutoTable.finalY + 10
    doc.text(`Subtotal: ₹${generatedQuotation.subtotal.toLocaleString("en-IN")}`, 140, finalY)
    doc.text(
      `GST (${generatedQuotation.gst}%): ₹${((generatedQuotation.subtotal * generatedQuotation.gst) / 100).toLocaleString("en-IN")}`,
      140,
      finalY + 7,
    )
    doc.setFont("helvetica", "bold")
    doc.text(`Total: ₹${generatedQuotation.total.toLocaleString("en-IN")}`, 140, finalY + 14)

    doc.save(`Quotation-${generatedQuotation.quotationNumber}.pdf`)
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
    Quotation
  </h2>

  <p className="text-gray-600">
    Create and manage project quotations
  </p>
</div>

      <Card>
        <CardHeader>
          <CardTitle>Create Quotation</CardTitle>
          <CardDescription>Generate quotation for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <Input value={quotationData.projectName} readOnly className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input value={quotationData.clientName} readOnly className="mt-1" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Items</h3>
              <Button onClick={addQuotationItem} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {quotationData.items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Item Description"
                          value={item.description}
                          onChange={(e) => updateQuotationItem(item.id, "description", e.target.value)}
                        />
                        <textarea
                          className="w-full min-h-[80px] md:min-h-[100px] p-2 border rounded-md text-sm"
                          placeholder="Full Description"
                          value={item.fullDescription}
                          onChange={(e) => updateQuotationItem(item.id, "fullDescription", e.target.value)}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

                          <Input
                            placeholder="Unit"
                            value={item.unit}
                            onChange={(e) => updateQuotationItem(item.id, "unit", e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={item.area}
                            onChange={(e) => updateQuotationItem(item.id, "area", parseFloat(e.target.value))}
                          />
                          <Input
                            type="number"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => updateQuotationItem(item.id, "rate", parseFloat(e.target.value))}
                          />
                          <Input placeholder="Amount" value={`₹${item.amount.toLocaleString()}`} readOnly />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="self-end md:self-start"
                      >

                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>₹{quotationData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">GST ({quotationData.gst}%):</span>
                <span>₹{((quotationData.subtotal * quotationData.gst) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{quotationData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={generateQuotation} className="bg-orange-600 hover:bg-orange-700">
            Generate Quotation
          </Button>
          {generatedQuotation && (
            <Button onClick={downloadQuotationPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </CardFooter>
      </Card>

      {generatedQuotation && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Quotation Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Quotation No:</p>
                  <p className="font-semibold">{generatedQuotation.quotationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date:</p>
                  <p className="font-semibold">{generatedQuotation.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Project:</p>
                  <p className="font-semibold">{generatedQuotation.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Client:</p>
                  <p className="font-semibold">{generatedQuotation.clientName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
