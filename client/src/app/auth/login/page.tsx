"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import banner from '../../../../public/images/banner2.jpg';
import logo from '../../../../public/images/logo.png';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { protectLoginAction } from '@/actions/auth';

function LoginPage() {
    const [isemail, setIsemail] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const { login, isLoading } = useAuthStore();
    const router = useRouter();
    



    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const checkFirstLevelOfValidation = await protectLoginAction(formData.email);
        if (!checkFirstLevelOfValidation.sucess) {
            toast.error(checkFirstLevelOfValidation.error)
            return;
        }
        const sucess = await login(formData.email, formData.password);
        if (sucess) {
            toast.success("Login Sucessful")
            const user=useAuthStore.getState().user;
            console.log(user);
            
            if(user?.role==="SUPER_ADMIN"){
                router.push("/super-admin")

            }
            else{
                router.push("/home")
            }
        }
        else{
            toast.error("invalid credentials")
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <Image
                src={banner}
                alt="Register"
                layout="responsive"
                objectFit="cover"
                objectPosition="center"
                className="absolute top-0 left-0 w-full h-full -z-10 opacity-60"
                priority
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 backdrop-blur-md bg-opacity-80 border border-white/30 relative"
            >
                <div className="flex justify-center mb-4">
                    <Image src={logo} width={150} height={50} alt="Logo" className="drop-shadow-lg" />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <motion.label
                            htmlFor="email"
                            animate={isemail ? { scale: 1, color: "grey", rotate: [0, 5, -5, 0] } : { scale: 1, color: "#000" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="font-medium block"
                        >
                            Email
                        </motion.label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email "
                            required
                            className=" from-[#414345] via-[#0f0f0f] to-[#414345] rounded-lg bg-gray-100"
                            value={formData.email}
                            onChange={handleOnChange}
                            onFocus={() => setIsemail(true)}
                            onBlur={() => setIsemail(false)}
                        />
                    </div>
                    <div className="space-y-1">
                        <motion.label
                            htmlFor="password"
                            animate={isPassword ? { scale: 1, color: "grey", rotate: [0, 5, -5, 0] } : { scale: 1, color: "#000" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="font-medium block"
                        >
                            Password
                        </motion.label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className=" from-[#414345] via-[#0f0f0f] to-[#414345] rounded-lg bg-gray-100"
                            value={formData.password}
                            onChange={handleOnChange}
                            onFocus={() => setIsPassword(true)}
                            onBlur={() => setIsPassword(false)}
                        />
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#414345] via-[#0f0f0f] to-[#414345] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-all"
                        >
                            {
                                isLoading ? "Loading..." : "LOGIN"
                            }
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                    <p className="text-center text-gray-700 text-sm">
                        New to Outfique? {" "}
                        <Link href="/auth/register" className="text-red-700 hover:underline font-bold">
                            Create Account
                        </Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}

export default LoginPage
