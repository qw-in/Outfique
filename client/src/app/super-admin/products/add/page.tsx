"use client"
import { protectProductFormAction } from '@/actions/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProductStore } from '@/store/useProductStore';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const categories = [
  "Fashion",
  "Electronics",
  "Home & Garden",
  "Sporting Goods",
  "Toys & Hobbies",
  "Business & Industrial",
  "Health & Beauty",
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const colors = [
  { name: "Red", class: "bg-red-500" },
  { name: "Blue", class: "bg-blue-500" },
  { name: "Green", class: "bg-green-500" },
  { name: "Yellow", class: "bg-yellow-500" },
  { name: "Purple", class: "bg-purple-500" },
  { name: "Pink", class: "bg-pink-500" },
];

const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];

interface FormState {
  name: string;
  brand: string;
  category: string;
  description: string;
  gender: string;
  price: string;
  stock: string;
}




function SuperAdminProductPage() {

  const [formState, setFormState] = useState<FormState>({
    name: "",
    brand: "",
    description: "",
    category: "",
    gender: "",
    price: "",
    stock: "",
  });

  const [selectedSizes, setSelectSizes] = useState<string[]>([]);
  const [selectedColors, setSelectColors] = useState<string[]>([]);
  const [selectedfiles, setSelectFiles] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const getCurrentProductId = searchParams.get("id");
  const isEditMode = !!getCurrentProductId;
  

  const router = useRouter();
  const { createProduct, updateProduct, getProductById, isLoading } = useProductStore();


  useEffect(() => {
    if (isEditMode) {
      getProductById(getCurrentProductId).then((product) => {
        if (product) {
          setFormState({
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category,
            gender:product.gender,
            price: product.price.toString(),
            stock: product.stock.toString(),
          })
          setSelectSizes(product.sizes);
          setSelectColors(product.colors);

        }
      })
    }
  }, [getCurrentProductId, isEditMode, getProductById]);


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleSize = (size: string) => {
    setSelectSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (color: string) => {
    setSelectColors((prev) =>
      prev.includes(color) ? prev.filter((s) => s !== color) : [...prev, color]
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectFiles(Array.from(event.target.files));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const checkFirstLevelSanitization = await protectProductFormAction()
    
    if (!checkFirstLevelSanitization.success) {
      toast.error(checkFirstLevelSanitization.error);
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("sizes", selectedSizes.join(","));
    formData.append("colors", selectedColors.join(","));

    selectedfiles.forEach((file) => {
      formData.append("images", file);
    });

    const result = isEditMode 
      ? await updateProduct(getCurrentProductId, formData)
      : await createProduct(formData);

    if (result) {
      router.push("/super-admin/products/list");
    }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          <header className="flex items-center justify-between">
            <motion.div
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 font-serif tracking-tight">
                {isEditMode ? "Edit Product" : "Add New Product"}
              </h1>
              <motion.div 
                className="absolute -bottom-2 left-0 h-1 bg-gray-900 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>    
          </header>

          <form onSubmit={handleFormSubmit} className="grid gap-8 md:grid-cols-2">
            {/* Upload Area */}
            {
              isEditMode ? null : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/80 backdrop-blur-sm p-12 transition-all hover:border-gray-300 hover:bg-white shadow-lg hover:shadow-xl"
                >
                  <div className="text-center flex flex-col items-center">
                    <Upload className="h-16 w-16 text-gray-600 cursor-pointer animate-pulse" />
                    <div className="mt-4 flex flex-col items-center">
                      <Label className="group flex flex-col items-center">
                        <motion.span 
                          className="cursor-pointer font-serif font-medium text-gray-700 transition-colors hover:text-gray-900"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          Click to Browse
                        </motion.span>
                        <Input
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                        />
                      </Label>
                      <p className="text-xs text-gray-500 mt-2">Upload high-quality images (max 5MB)</p>
                    </div>
                  </div>
                  {selectedfiles.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 flex flex-wrap gap-3"
                    >
                      {selectedfiles.map((file, index) => (
                        <motion.div 
                          key={index} 
                          className="relative group"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            width={80}
                            height={80}
                            className="h-20 w-20 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm">Preview</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )
            }

            {/* Form Fields */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div>
                <Label className="text-sm font-serif font-medium text-gray-700">
                  <span>Product Name</span>
                  <Input
                    name="name"
                    onChange={handleInputChange}
                    value={formState.name}
                    placeholder="Enter captivating product name"
                    className="mt-1.5 rounded-lg border-gray-200 bg-white/50 focus:border-gray-500 focus:ring focus:ring-gray-200/50 focus:ring-opacity-50 transition-all duration-200 font-serif"
                  />
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-serif font-medium text-gray-700">
                    <span>Brand</span>
                    <Select value={formState.brand} onValueChange={(value) => handleSelectChange('brand', value)} name="brand">
                      <SelectTrigger className="mt-1.5 rounded-lg border-gray-200 bg-white/50 focus:border-gray-500 focus:ring focus:ring-gray-200/50 focus:ring-opacity-50 font-serif">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(item => <SelectItem key={item} value={item.toLocaleLowerCase()} className="font-serif">{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Label>
                </div>

                <div>
                  <Label className="text-sm font-serif font-medium text-gray-700">
                    <span>Category</span>
                    <Select value={formState.category} onValueChange={(value) => handleSelectChange('category', value)} name="category">
                      <SelectTrigger className="mt-1.5 rounded-lg border-gray-200 bg-white/50 focus:border-gray-500 focus:ring focus:ring-gray-200/50 focus:ring-opacity-50 font-serif">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(item => <SelectItem key={item} value={item.toLocaleLowerCase()} className="font-serif">{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Label>
                </div>
              </div>

              <div>
                <Label className="text-sm font-serif font-medium text-gray-700">
                  <span>Product Description</span>
                  <Textarea
                    name="description"
                    onChange={handleInputChange}
                    value={formState.description}
                    className="mt-1.5 min-h-[120px] rounded-lg border-gray-200 bg-white/50 focus:border-gray-500 focus:ring focus:ring-gray-200/50 focus:ring-opacity-50 transition-all duration-200 font-serif"
                    placeholder="Describe your product in detail to attract customers"
                  />
                </Label>
              </div>

              <div>
                <Label className="text-sm font-serif font-medium text-gray-700">Gender</Label>
                <Select value={formState.gender} onValueChange={(value) => handleSelectChange('gender', value)} name="gender">
                  <SelectTrigger className="mt-1.5 rounded-lg border-gray-200 bg-white/50 focus:border-gray-500 focus:ring focus:ring-gray-200/50 focus:ring-opacity-50 font-serif">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men" className="font-serif">Men</SelectItem>
                    <SelectItem value="women" className="font-serif">Women</SelectItem>
                    <SelectItem value="kids" className="font-serif">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-serif font-medium text-gray-700">Available Sizes</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.map((item) => (
                    <Button
                      onClick={() => handleToggleSize(item)}
                      key={item}
                      type="button"
                      size="sm"
                      variant={selectedSizes.includes(item) ? "default" : "outline"}
                      className="rounded-full px-4 border-2 hover:bg-gray-100/50 hover:border-gray-500 focus:ring-2 focus:ring-gray-500/50 focus:ring-opacity-50 transition-all duration-200 font-serif"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-serif font-medium text-gray-700">Available Colors</Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <Button
                      onClick={() => handleToggleColor(color.name)}
                      key={color.name}
                      type="button"
                      className={`h-10 w-10 rounded-full ${color.class} transition-all duration-200 ${
                        selectedColors.includes(color.name)
                          ? "ring-2 ring-primary ring-offset-2 scale-110"
                          : "hover:scale-110"
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-serif font-medium text-gray-700">Product Price</Label>
                  <Input
                    value={formState.price}
                    onChange={handleInputChange}
                    name="price"
                    className="mt-1.5 rounded-lg border-gray-200 bg-white/50 focus:border-gray-500 focus:ring focus:ring-gray-200/50 focus:ring-opacity-50 transition-all duration-200 font-serif"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label className="text-sm font-serif font-medium text-gray-700">Stock</Label>
                  <Input
                    value={formState.stock}
                    onChange={handleInputChange}
                    name="stock"
                    className="mt-1.5 rounded-lg border-gray-200 bg-white/50 focus:border-gray-500 focus:ring focus:ring-gray-200/50 focus:ring-opacity-50 transition-all duration-200 font-serif"
                    placeholder="Available quantity"
                  />
                </div>
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="relative mt-8 w-full bg-gray-900 text-white font-serif font-medium py-3 rounded-lg shadow-lg overflow-hidden transition-all duration-300 group hover:bg-gray-800"
              >
                <span className="relative z-10">
                  {isLoading ? "Creating..." : isEditMode ? "Update Product" : "Create Product"}
                </span>
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminProductPage