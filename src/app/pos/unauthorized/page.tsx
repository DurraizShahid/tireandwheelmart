import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function POSUnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Unauthorized</CardTitle>
          <CardDescription className="text-base">
            You don&apos;t have permission to access the Point of Sale system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please contact your administrator if you believe this is a mistake.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin">Go to Dashboard</Link>
          </Button>
          <SignOutButton>
            <Button variant="destructive">Sign Out</Button>
          </SignOutButton>
        </CardFooter>
      </Card>
    </div>
  );
}
