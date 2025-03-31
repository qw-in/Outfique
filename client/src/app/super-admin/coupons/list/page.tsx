"use client";

import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Package, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { AnimatedButton } from "@/components/ui/aceternity/animated-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SuperAdminCouponsListingPage() {
  const { isLoading, couponList, fetchCoupons, deleteCoupon, error } =
    useCouponStore();
  const router = useRouter();
  const fetchCouponRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (!fetchCouponRef.current) {
      console.log("Component mounted, fetching coupons...");
      fetchCoupons();
      fetchCouponRef.current = true;
    }
  }, [fetchCoupons]);

  useEffect(() => {
    console.log("Current couponList state:", couponList);
  }, [couponList]);

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const result = await deleteCoupon(id);
      if (result) {
        toast.success("Coupon deleted successfully");
        fetchCoupons();
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const filteredCoupons = couponList?.filter(coupon => 
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          animate={{
            rotate: 360,
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Package size={40} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!couponList || couponList.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p>No coupons found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <BackgroundBeams className="absolute inset-0 opacity-20" />
      
      <div className="max-w-6xl mx-auto relative">
        <Card className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <motion.div
                className="relative"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-4xl font-bold text-gray-900 font-serif tracking-tight">
                  All Coupons
                </CardTitle>
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 bg-gray-900 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <AnimatedButton 
                  onClick={() => router.push("/super-admin/coupons/add")}
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 transition-all duration-300"
                >
                  <Plus className="mr-2" />
                  Add New Coupon
                </AnimatedButton>
              </motion.div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search coupons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
              <AnimatedButton variant="outline" className="rounded-full">
                <Filter className="mr-2" />
                Filter
              </AnimatedButton>
            </div>

            <motion.div
              className="rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-serif font-bold text-gray-900">Code</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">Discount</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">Usage</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">Start Date</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">End Date</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">Status</TableHead>
                      <TableHead className="text-right font-serif font-bold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredCoupons?.map((coupon, index) => (
                      <motion.tr
                        key={coupon.id}
                        variants={itemVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3 }}
                        className="hover:bg-white/60 transition-colors duration-200"
                        layout
                      >
                        <TableCell>
                          <motion.p 
                            className="font-serif font-medium text-gray-800"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {coupon.code}
                          </motion.p>
                        </TableCell>
                        <TableCell>
                          <motion.span
                            className="font-serif font-medium text-gray-800"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {coupon.discountPercent}%
                          </motion.span>
                        </TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {coupon.usageCount}/{coupon.usageLimit}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-serif text-gray-700">
                            {format(new Date(coupon.startDate), "dd MMM yyyy")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-serif text-gray-700">
                            {format(new Date(coupon.endDate), "dd MMM yyyy")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${
                            new Date(coupon.endDate) > new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {new Date(coupon.endDate) > new Date()
                              ? "Active"
                              : "Expired"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <motion.div
                              variants={buttonVariants}
                              initial="initial"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <AnimatedButton
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 hover:bg-red-100/50 rounded-full transition-colors duration-200 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </AnimatedButton>
                            </motion.div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </Table>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default SuperAdminCouponsListingPage;
