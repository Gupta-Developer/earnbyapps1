"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserCircle2 } from "lucide-react";

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
        <div className="flex flex-col items-center justify-center pt-24 gap-4 text-center">
            <UserCircle2 className="w-24 h-24 text-muted-foreground/50" />
            <p className="text-muted-foreground">Sign in to manage your profile and earnings.</p>
            <Button onClick={handleLogin} size="lg" className="shadow-md rounded-full">
                Sign In with Google
            </Button>
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
}
