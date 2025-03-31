"use client"
import React, { useState } from 'react'
import { useCouponStore } from '@/store/useCouponStore'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { protectCouponFormAction } from '@/actions/coupons'
import { motion } from 'framer-motion'
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import { Ticket, Wand2, Percent, Users, Calendar, Hash, Save } from 'lucide-react'


function AddCouponPage() {
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
  });

const router = useRouter();
const { createCoupon, isLoading } = useCouponStore();

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};


const handleCreateUniqueCoupon = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  setFormData((prev) => ({
    ...prev,
    code: result,
  }));
};

const handleCouponSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  if (new Date(formData.endDate) <= new Date(formData.startDate)) {
    toast("End date must be after start date");
    return;
  }

  const checkCouponFormvalidation = await protectCouponFormAction();
  if (!checkCouponFormvalidation.success) {
    toast(checkCouponFormvalidation.error);
    return;
  }

  const couponData = {
    ...formData,
    discountPercent: parseFloat(formData.discountPercent.toString()),
    usageLimit: parseInt(formData.usageLimit.toString()),
  };

  const result = await createCoupon(couponData);
  if (result) {
    router.push("/super-admin/coupons/list");
  }
};

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden shadow-lg border border-gray-100">
        <CardHeader className="bg-white border-b border-gray-100">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Ticket className="h-8 w-8 text-gray-600" />
            <CardTitle className="text-2xl font-bold text-gray-900 font-serif">Create New Coupon</CardTitle>
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleCouponSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium font-serif">
                    <Hash size={16} className="text-gray-500" />
                    Coupon Code
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      name="code"
                      placeholder="Enter coupon code"
                      className="border-gray-200 focus:border-gray-400 focus:ring-gray-200 font-serif"
                      required
                      value={formData.code}
                      onChange={handleInputChange}
                    />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="button"
                        onClick={handleCreateUniqueCoupon}
                        className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 font-serif"
                      >
                        <Wand2 size={16} />
                        Generate
                      </Button>
                    </motion.div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium font-serif">
                    <Percent size={16} className="text-gray-500" />
                    Discount Percentage
                  </Label>
                  <Input
                    type="number"
                    name="discountPercent"
                    placeholder="Enter discount percentage"
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-200 font-serif"
                    required
                    value={formData.discountPercent}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium font-serif">
                    <Calendar size={16} className="text-gray-500" />
                    Start Date
                  </Label>
                  <Input
                    value={formData.startDate}
                    onChange={handleInputChange}
                    name="startDate"
                    type="date"
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-200 font-serif"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium font-serif">
                    <Calendar size={16} className="text-gray-500" />
                    End Date
                  </Label>
                  <Input
                    value={formData.endDate}
                    onChange={handleInputChange}
                    name="endDate"
                    type="date"
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-200 font-serif"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium font-serif">
                    <Users size={16} className="text-gray-500" />
                    Usage Limits
                  </Label>
                  <Input
                    type="number"
                    name="usageLimit"
                    placeholder="Enter usage limits"
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-200 font-serif"
                    required
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                  />
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pt-6"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit" 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-lg py-6 font-serif"
                  disabled={isLoading}
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Save size={20} />
                    )}
                  </motion.div>
                  {isLoading ? "Creating Coupon..." : "Create Coupon"}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  </div>
)
}

export default AddCouponPage