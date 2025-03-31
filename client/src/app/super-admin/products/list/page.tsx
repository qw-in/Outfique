"use client"
import { Button } from '@/components/ui/button';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProductStore } from '@/store/useProductStore'
import { Pencil, Trash2, Package, ShoppingBag, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function ListingPage() {
  const { products, isLoading, fetchAllProductsForAdmin, deleteProduct } = useProductStore();
  const router = useRouter();
  const productFetchRef = useRef(false); //this ref is used to prevent the fetchAllProductsForAdmin from being called multiple times
  
  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin])

  async function handleDeleteProduct(id: string) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(id);
      if (result) {
        toast.success("Product deleted successfully");
        fetchAllProductsForAdmin();
      } else {
        toast.error("Failed to delete product");
      }
    }
  }

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

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col gap-8">
          <motion.header 
            className="flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 font-serif tracking-tight">
                All Products
              </h1>
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
              <Button 
                onClick={() => router.push("/super-admin/products/add")}
                className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-6 transition-all duration-300"
              >
                Add New Product
              </Button>
            </motion.div>
          </motion.header>
          
          <motion.div 
            className="rounded-xl border border-gray-100 bg-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-serif font-bold text-gray-900">Product Name</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">Price</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">Stock</TableHead>
                      <TableHead className="font-serif font-bold text-gray-900">Category</TableHead>
                      <TableHead className="text-right font-serif font-bold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        variants={itemVariants}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3 }}
                        className="hover:bg-white/60 transition-colors duration-200"
                        layout
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="rounded-lg bg-white/60 overflow-hidden w-16 h-16 shadow-sm"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              {product.images[0] && (
                                <Image
                                  src={product.images[0]}
                                  alt="product image"
                                  width={60}
                                  height={60}
                                  className="object-cover w-full h-full"
                                />
                              )}
                            </motion.div>
                            <div>
                              <motion.p 
                                className="font-serif font-medium text-gray-800"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {product.name}
                              </motion.p>
                              <motion.p 
                                className="text-sm text-gray-500 font-serif"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                Size: {product.sizes.join(", ")}
                              </motion.p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-serif font-medium text-gray-800">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            ${product.price.toFixed(2)}
                          </motion.span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {product.stock} items left
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                            {product.category.toLocaleUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <motion.div
                              variants={buttonVariants}
                              initial="initial"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                onClick={() => router.push(`/super-admin/products/add?id=${product.id}`)}
                                variant="ghost"
                                size="icon"
                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100/50 rounded-full transition-colors duration-200"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              variants={buttonVariants}
                              initial="initial"
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Button
                                onClick={() => handleDeleteProduct(product.id)}
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-800 hover:bg-red-100/50 rounded-full transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </Table>
              </div>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-16 px-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-indigo-50 rounded-full p-6 mb-4"
                >
                  <ShoppingBag size={48} className="text-indigo-600" />
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-serif font-semibold text-gray-800 mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  No Products Found
                </motion.h3>
                
                <motion.p 
                  className="text-gray-500 text-center max-w-md mb-6 font-serif"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  You haven&apos;t added any products to your store yet. Add your first product to get started.
                </motion.p>
                
                <motion.div
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    onClick={() => router.push("/super-admin/products/add")}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 flex items-center gap-2 rounded-full px-6 transition-all duration-300"
                  >
                    <Plus size={16} />
                    Add Your First Product
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default ListingPage