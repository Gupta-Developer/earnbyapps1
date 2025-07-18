"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, UserCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.92 1.62-3.27 0-5.93-2.66-5.93-5.93s2.66-5.93 5.93-5.93c1.7 0 2.95.65 3.89 1.55l2.64-2.59c-1.62-1.5-3.75-2.4-6.53-2.4-5.35 0-9.68 4.34-9.68 9.68s4.33 9.68 9.68 9.68c2.83 0 5.17-1 6.9-2.73 1.76-1.74 2.64-4.2 2.64-6.34 0-.6-.05-1.16-.16-1.72h-9.3z" fill="currentColor"/>
    </svg>
)

type ProfileData = {
  fullName: string;
  phone: string;
  upiId: string;
};

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    phone: "",
    upiId: "",
  });

  const { toast } = useToast();

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({ title: "Logged in successfully!" });
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as { fullName: string, phone: string, upiId: string };
    setProfile(data);
    toast({ 
        title: "Profile Saved!",
        description: "Your information has been updated.",
        className: "bg-accent text-accent-foreground border-accent"
    });
  };

  return (
    <div className="p-4 space-y-6">
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center pt-12 gap-6 text-center">
            <UserCircle2 className="w-24 h-24 text-muted-foreground/50" />
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Sign In to Your Account</h1>
                <p className="text-muted-foreground">Manage your profile and earnings.</p>
            </div>
            
            <div className="w-full max-w-sm space-y-4">
                <Button onClick={handleLogin} size="lg" className="w-full shadow-md rounded-full" variant="outline">
                    <GoogleIcon />
                    Continue with Google
                </Button>
                
                <div className="flex items-center gap-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="Continue with Email" className="pl-10 h-11 rounded-full" required />
                    </div>
                    <Button type="submit" size="lg" className="w-full shadow-md rounded-full">
                        Continue
                    </Button>
                </form>
            </div>
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Update your profile details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="e.g. John Doe" defaultValue={profile.fullName} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="e.g. 9876543210" defaultValue={profile.phone} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input id="upiId" name="upiId" placeholder="e.g. yourname@bank" defaultValue={profile.upiId} required />
                </div>
                <Button type="submit" className="w-full shadow-md">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
          
          {profile.fullName && (
             <Card className="shadow-md rounded-lg">
                <CardHeader>
                    <CardTitle>Saved Data Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div><strong className="text-muted-foreground">Full Name:</strong> {profile.fullName}</div>
                    <div><strong className="text-muted-foreground">Phone:</strong> {profile.phone}</div>
                    <div><strong className="text-muted-foreground">UPI ID:</strong> {profile.upiId}</div>
                </CardContent>
             </Card>
          )}
        </div>
      )}
    </div>
  );

    