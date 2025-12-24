"use client"

import React, { useState } from "react"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function MaterialsPage() {
  const [statusFilter, setStatusFilter] = useState("all")

  const [materialOrders, setMaterialOrders] = useState([
    {
      id: "MO-001",
      materialName: "Cement - OPC 53 Grade",
      requestedQty: 500,
      approvedQty: 450,
      unit: "Bags",
      siteLocation: "Tower A - Floor 5",
      requestedBy: "Site Engineer - Rajesh",
      status: "approved",
      usedQty: 470,
      remainingQty: -20,
      leakage: true,
    },
    {
      id: "MO-002",
      materialName: "TMT Steel Bars - 12mm",
      requestedQty: 10,
      approvedQty: 10,
      unit: "Tons",
      siteLocation: "Tower B - Floor 3",
      requestedBy: "Site Engineer - Amit",
      status: "approved",
      usedQty: 8,
      remainingQty: 2,
      leakage: false,
    },
    {
      id: "MO-003",
      materialName: "River Sand",
      requestedQty: 15,
      approvedQty: 0,
      unit: "Tons",
      siteLocation: "Tower A - Floor 2",
      requestedBy: "Site Engineer - Priya",
      status: "pending",
      usedQty: 0,
      remainingQty: 0,
      leakage: false,
    },
  ])

  const [showMaterialApproval, setShowMaterialApproval] = useState(false)
  const [selectedMaterialOrder, setSelectedMaterialOrder] = useState(null)
  const [approvedQuantity, setApprovedQuantity] = useState("")

  const handleApproveClick = (order) => {
    setSelectedMaterialOrder(order)
    setApprovedQuantity(order.requestedQty.toString())
    setShowMaterialApproval(true)
  }

  const confirmApproveMaterial = () => {
    if (selectedMaterialOrder && approvedQuantity) {
      // parseFloat is used here instead of Number.parseFloat for standard JS readability
      const approvedQty = parseFloat(approvedQuantity)
      setMaterialOrders(
        materialOrders.map((order) =>
          order.id === selectedMaterialOrder.id
            ? {
                ...order,
                status: "approved",
                approvedQty: approvedQty,
                remainingQty: approvedQty,
              }
            : order,
        ),
      )
      setShowMaterialApproval(false)
      setSelectedMaterialOrder(null)
      setApprovedQuantity("")
    }
  }

  const handleRejectMaterial = (id) => {
  setMaterialOrders(
    materialOrders.map((order) =>
      order.id === id ? { ...order, status: "rejected" } : order
    )
  )
}
  const filteredAndSortedOrders = materialOrders
  .filter(order => {
    if (statusFilter === "all") return true
    return order.status === statusFilter
  })
  .sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1
    if (a.status !== "pending" && b.status === "pending") return 1
    return 0
  })


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Material Orders</h2>
        <p className="text-gray-600">Manage material requisitions and approvals</p>
      </div>
      {/* FILTER BAR */}
<div className="flex gap-2 bg-gray-50 p-3 rounded-lg border">
  {["all", "pending", "approved", "rejected"].map((status) => (
    <button
      key={status}
      onClick={() => setStatusFilter(status)}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
        ${
          statusFilter === status
            ? "bg-black text-white border-black"
            : "bg-white text-gray-500 hover:bg-gray-100"
        }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  ))}
</div>

      <Card>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedOrders.map((order) => (
              <Card key={order.id} className={order.leakage ? "border-red-300" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{order.materialName}</h3>
                        {order.leakage && (
                          <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Shortage
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                      <p className="text-sm text-gray-600">Location: {order.siteLocation}</p>
                      <p className="text-sm text-gray-600">Requested by: {order.requestedBy}</p>
                    </div>
                    <div>
                      {order.status === "approved" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>
                      )}
                      {order.status === "pending" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                      )}
                      {order.status === "rejected" && (
                        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">Rejected</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">Requested Qty</p>
                      <p className="font-semibold">
                        {order.requestedQty} {order.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Approved Qty</p>
                      <p className="font-semibold">
                        {order.approvedQty} {order.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Used Qty</p>
                      <p className="font-semibold">
                        {order.usedQty} {order.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Remaining</p>
                      <p className={`font-semibold ${order.remainingQty < 0 ? "text-red-600" : ""}`}>
                        {order.remainingQty} {order.unit}
                      </p>
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveClick(order)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectMaterial(order.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-md"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                  {order.status === "pending" &&
  showMaterialApproval &&
  selectedMaterialOrder?.id === order.id && (
    <div className="mt-4 p-4 rounded-lg border bg-orange-50 space-y-3">
      <p className="text-sm font-medium">
        Approve Quantity (Requested: {order.requestedQty} {order.unit})
      </p>

      <Input
        type="number"
        value={approvedQuantity}
        onChange={(e) => setApprovedQuantity(e.target.value)}
        className="max-w-xs"
      />

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={confirmApproveMaterial}
          className="bg-green-600 hover:bg-green-700"
        >
          Confirm
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowMaterialApproval(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
)}

                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}