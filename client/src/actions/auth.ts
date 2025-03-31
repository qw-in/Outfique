"use server";

import { protectSignupRules , protectLogin } from "@/arcjet";
import { request } from "@arcjet/next";

export const protectSignupAction = async (email:string) => {

    const req = await request()
    const decision = await protectSignupRules.protect(req, { email });

    if(decision.isDenied()){
        if(decision.reason.isEmail()){
            const emailTypes = decision.reason.emailTypes;
            if(emailTypes.includes("DISPOSABLE")){
                return { sucess:false,status: 403, error: "Disposable email addresses are not allowed." }

            }
            else if(emailTypes.includes("INVALID")){
                return { sucess:false,status: 403, error: "Invalid email." }

            }
            else if(emailTypes.includes("NO_MX_RECORDS")){
                return { sucess:false,status: 403, error: "No MX records found for this email." }

            }
        }
        else if(decision.reason.isBot()){
            return { sucess:false,status: 403, error: "Bot detected." }
        }
        else if(decision.reason.isRateLimit()){
            return { sucess:false,status: 403, error: "Too many requests! Try again later." }
        }
    }
    return { sucess:true }
}

export const protectLoginAction = async (email:string) => {

    const req = await request()
    const decision = await protectLogin.protect(req, { email });

    if(decision.isDenied()){
        if(decision.reason.isEmail()){
            const emailTypes = decision.reason.emailTypes;
            if(emailTypes.includes("DISPOSABLE")){
                return { sucess:false,status: 403, error: "Disposable email addresses are not allowed." }

            }
            else if(emailTypes.includes("INVALID")){
                return { sucess:false,status: 403, error: "Invalid email." }

            }
            else if(emailTypes.includes("NO_MX_RECORDS")){
                return { sucess:false,status: 403, error: "No MX records found for this email." }

            }
        }
        else if(decision.reason.isRateLimit()){
            return { sucess:false,status: 403, error: "Too many requests! Try again later." }
        }
    }
    return { sucess:true }
}