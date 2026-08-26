"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const REDIRECT_SECONDS = 5;

export default function NotFound() {
    const router = useRouter();

    const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

    useEffect(() => {
        if (countdown <= 0) {
            if (window.history.length > 1) {
                router.back();
            } else {
                router.replace("/");
            }
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, router]);

    const progress = (countdown / REDIRECT_SECONDS) * 100;

    return (
        <section className="flex flex-1 items-center justify-center py-16">
            <Card className="w-full max-w-lg">
                <CardHeader className="items-center text-center">

                    <p className="text-6xl font-bold tracking-tight">404</p>

                    <CardTitle className="mt-2 text-2xl">
                        Page Not Found
                    </CardTitle>

                    <CardDescription>
                        The page you're looking for doesn't exist, may have been moved,
                        or the URL is incorrect.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Progress value={progress} />

                        <p className="text-center text-sm text-muted-foreground">
                            Redirecting{" "}
                            <span className="font-medium text-foreground">
                                in {countdown}s
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button className="flex-1 cursor-pointer ">
                            <Link href="/">
                                Home
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                                if (window.history.length > 1) {
                                    router.back();
                                } else {
                                    router.replace("/");
                                }
                            }}
                        >
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}