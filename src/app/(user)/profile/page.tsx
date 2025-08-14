
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, UserCircle2, KeyRound, LogOut, Pencil, Phone, Landmark, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";


const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2">
      <title>Google</title>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
);

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const profileSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional().or(z.literal('')),
    upiId: z.string().refine(val => !val || /.+@.+/.test(val), { message: "Please enter a valid UPI ID." }).optional().or(z.literal('')),
});

const levels = [
    { name: "Newbie", required: 0, color: "bg-gray-500" },
    { name: "Explorer", required: 5, color: "bg-green-500" },
    { name: "Pro", required: 10, color: "bg-blue-500" },
    { name: "Master", required: 25, color: "bg-purple-500" },
    { name: "Legend", required: 50, color: "bg-yellow-500" },
]


export default function ProfilePage() {
  const { user, appUser, loading, error, signUp, signIn, signInWithGoogle, signOut, updateAppUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const redirectTo = searchParams.get('redirect_to');
  const [completedTasks, setCompletedTasks] = useState(0);


  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
     defaultValues: { fullName: "", email: "", password: "" },
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "", upiId: "" },
  });
  
  const fetchUserData = () => {
      if (appUser) {
        let userDetails = {
            fullName: appUser.fullName || "",
            phone: appUser.phone || "",
            upiId: appUser.upiId || "",
        };

        profileForm.reset(userDetails);
        
        if (redirectTo && (!userDetails.phone || !userDetails.upiId)) {
            setIsEditing(true);
            toast({
                title: "Complete Your Profile",
                description: "Please fill in your details to continue.",
            });
        }
      }
    };
    
  useEffect(() => {
    const fetchTransactionData = async () => {
        if (user) {
            const transactionsRef = collection(db, "transactions");
            const q = query(transactionsRef, where("userId", "==", user.uid), where("status", "in", ["Paid", "Approved"]));
            const querySnapshot = await getDocs(q);
            setCompletedTasks(querySnapshot.size);
        }
    };

    if (user) {
        fetchUserData();
        fetchTransactionData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, appUser, redirectTo]);

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    const { email, password } = data;
    await signIn(email, password);
    toast({ title: "Logged in successfully!" });
  };

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    const { fullName, email, password } = data;
    await signUp(email, password, fullName);
    toast({ title: "Account created and logged in!" });
  };
  
  const handleProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to save.", variant: "destructive" });
        return;
    }
    
    await updateAppUser(data);
    
    toast({ 
        title: "Profile Saved!",
        description: "Your information has been updated.",
        className: "bg-accent text-accent-foreground border-accent"
    });
    setIsEditing(false);

    if (redirectTo) {
        router.push(redirectTo);
    }
  };
  
  const handleCancelEdit = () => {
    fetchUserData(); // Refetch data to discard changes
    setIsEditing(false);
  }
  
  const { currentLevel, nextLevel, progress } = (() => {
    if (!user) return { currentLevel: levels[0], nextLevel: levels[1], progress: 0 };
    
    let currentLvl = levels[0];
    for (let i = levels.length - 1; i >= 0; i--) {
        if (completedTasks >= levels[i].required) {
            currentLvl = levels[i];
            break;
        }
    }

    const nextLvlIndex = levels.findIndex(l => l.name === currentLvl.name) + 1;
    const nextLvl = nextLvlIndex < levels.length ? levels[nextLvlIndex] : null;

    let progressPercentage = 100;
    if (nextLvl) {
        const tasksForNextLevel = nextLvl.required - currentLvl.required;
        const tasksDoneForLevel = completedTasks - currentLvl.required;
        progressPercentage = (tasksDoneForLevel / tasksForNextLevel) * 100;
    }

    return {
        currentLevel: currentLvl,
        nextLevel: nextLvl,
        progress: progressPercentage,
    };
  })();


  if (loading) {
      return (
          <div className="flex items-center justify-center h-full">
              <p>Loading...</p>
          </div>
      )
  }

  return (
    <div className="py-4 space-y-6">
      {!user ? (
        <div className="flex flex-col items-center justify-center pt-8 gap-6 text-center">
            <UserCircle2 className="w-20 h-20 text-muted-foreground/50" />
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">Welcome to EarnByApps</h1>
                <p className="text-muted-foreground">Sign in or create an account to start earning.</p>
            </div>
            
            <Card className="w-full max-w-sm shadow-md">
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <CardHeader>
                            <CardTitle>Sign In</CardTitle>
                            <CardDescription>Enter your credentials to access your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Form {...signInForm}>
                                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                                    <FormField
                                        control={signInForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                        <Input type="email" placeholder="Email" className="pl-10 h-11" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signInForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                     <div className="relative">
                                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                        <Input type="password" placeholder="Password" className="pl-10 h-11" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                   
                                    <Button type="submit" size="lg" className="w-full shadow-md" disabled={signInForm.formState.isSubmitting}>
                                        {signInForm.formState.isSubmitting ? "Signing In..." : "Continue"}
                                    </Button>
                                </form>
                            </Form>
                             <div className="flex items-center gap-2">
                                <Separator className="flex-1" />
                                <span className="text-xs text-muted-foreground">OR</span>
                                <Separator className="flex-1" />
                            </div>
                             <Button onClick={signInWithGoogle} size="lg" className="w-full shadow-md" variant="outline">
                                <GoogleIcon />
                                Continue with Google
                            </Button>
                        </CardContent>
                    </TabsContent>
                    <TabsContent value="signup">
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>Create an account to start your journey.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Form {...signUpForm}>
                                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                                     <FormField
                                        control={signUpForm.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                        <Input placeholder="Full Name" className="pl-10 h-11" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                        <Input type="email" placeholder="Email" className="pl-10 h-11" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={signUpForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                     <div className="relative">
                                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                        <Input type="password" placeholder="Password" className="pl-10 h-11" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" size="lg" className="w-full shadow-md" disabled={signUpForm.formState.isSubmitting}>
                                        {signUpForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                                    </Button>
                                </form>
                            </Form>
                             <div className="flex items-center gap-2">
                                <Separator className="flex-1" />
                                <span className="text-xs text-muted-foreground">OR</span>
                                <Separator className="flex-1" />
                            </div>
                             <Button onClick={signInWithGoogle} size="lg" className="w-full shadow-md" variant="outline">
                                <GoogleIcon />
                                Continue with Google
                            </Button>
                        </CardContent>
                    </TabsContent>
                </Tabs>
                 {error && <p className="text-destructive text-sm mt-4 text-center">{error}</p>}
            </Card>
        </div>
      ) : (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photoURL || undefined} alt="User profile picture" />
                        <AvatarFallback>
                            <UserCircle2 className="w-8 h-8" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle>Welcome, {appUser?.fullName || user.displayName || "User"}!</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                     <Button onClick={signOut} variant="outline">
                        <LogOut className="mr-2 h-4 w-4"/>
                        Sign Out
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-primary" />
                        Your Progress
                    </CardTitle>
                    <CardDescription>Complete tasks to level up and earn new badges!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center gap-4">
                        <Badge className={`px-3 py-1 text-sm text-white ${currentLevel.color}`}>{currentLevel.name}</Badge>
                        <p className="text-sm text-muted-foreground font-medium">Completed Tasks: {completedTasks}</p>
                    </div>
                    {nextLevel ? (
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <p className="text-sm font-medium">Next Level: {nextLevel.name}</p>
                                <p className="text-sm text-muted-foreground">{completedTasks} / {nextLevel.required}</p>
                            </div>
                            <Progress value={progress} />
                        </div>
                    ) : (
                        <p className="font-semibold text-accent">You've reached the highest level! Congratulations!</p>
                    )}
                </CardContent>
            </Card>

            {isEditing ? (
                 <Card className="shadow-md rounded-lg">
                    <CardHeader>
                    <CardTitle>Edit Your Information</CardTitle>
                    <CardDescription>Update your profile details below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                                <FormField
                                    control={profileForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={profileForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="e.g. 9876543210" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={profileForm.control}
                                    name="upiId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>UPI ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. yourname@bank" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-2 justify-end pt-4">
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                                    <Button type="submit" className="shadow-md" disabled={profileForm.formState.isSubmitting}>
                                    {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Your Information</CardTitle>
                            <CardDescription>View your saved details.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-5 w-5"/>
                            <span className="sr-only">Edit Information</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <UserCircle2 className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-semibold">{appUser?.fullName || 'Not set'}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <Phone className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Phone Number</p>
                                <p className="font-semibold">{appUser?.phone || 'Not set'}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <Landmark className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">UPI ID</p>
                                <p className="font-semibold">{appUser?.upiId || 'Not set'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
      )}
    </div>
  );
}
