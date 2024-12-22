"use client"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButtons({type,loading}) {
   
    
    return (
        <>
            {
                loading ? (
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </Button>
                ) : (
                        <Button type="submit">{type}</Button>
                )
            }
        </>
    )
}