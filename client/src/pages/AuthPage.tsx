/**
 * AuthPage.tsx
 * 
 * Authentication page for login, registration, and two-factor authentication.
 */
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth"; // Import from updated auth hook
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Redirect, Link } from "wouter";
import { Loader2, Eye, EyeOff, Info, Check, X, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { TwoFactorAuth } from "@/components/auth/TwoFactorAuth";
import { useMutation } from "@tanstack/react-query";

const passwordStrengthText = {
  0: "Very Weak",
  1: "Weak",
  2: "Medium",
  3: "Strong",
  4: "Very Strong"
};

const passwordStrengthColor = {
  0: "bg-red-500",
  1: "bg-orange-500",
  2: "bg-yellow-500",
  3: "bg-green-500",
  4: "bg-emerald-500"
};

const passwordRules = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[A-Z]/, text: "At least one uppercase letter" },
  { regex: /[a-z]/, text: "At least one lowercase letter" },
  { regex: /[0-9]/, text: "At least one number" },
  { regex: /[^A-Za-z0-9]/, text: "At least one special character" }
];

function calculatePasswordStrength(password: string): number {
  return passwordRules.reduce((score, rule) =>
    score + (rule.regex.test(password) ? 1 : 0), 0);
}

const registrationSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type ContactForm = z.infer<typeof registrationSchema>;

type LoginForm = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export default function AuthPage() {
  const { 
    user, 
    isLoading, 
    requires2FA,
    verify2FAMutation,
    verifyBackupCodeMutation,
    clearRequires2FA,
    setUser,
    setRequires2FA
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordReqOpen, setIsPasswordReqOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = login, 1 = register

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string; rememberMe: boolean }) => {
      try {
        console.log('Attempting login with data:', { 
          username: data.username,
          password: '******', // Don't log the actual password
          rememberMe: data.rememberMe
        });
        
        // Use JWT login endpoint instead of session-based login
        const response = await fetch('/api/jwt/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password
          }),
          credentials: 'include' // Important: Include credentials for cookies
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }
        
        const result = await response.json();
        console.log('JWT Login response:', result);
        
        // Check if login was successful based on the success flag
        if (!result.success) {
          throw new Error(result.message || 'Login failed');
        }
        
        return result;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Handle successful login
      console.log('Login successful, received data:', data);
      
      // JWT endpoints return { success: true, user: {...}, token: "..." }
      // Extract the user data from response
      const userData = data.user || null;
      const token = data.token || null;
      
      if (!userData) {
        console.error('Login response did not contain user data');
        alert('Login was successful but the server response was missing user data. Please try again.');
        return;
      }
      
      // Check if 2FA is required
      if (data.requires2FA) {
        // Store 2FA requirement in session storage and update auth context
        window.sessionStorage.setItem('requires2FA', 'true');
        
        // Update the auth context to show 2FA screen
        if (setRequires2FA) {
          setRequires2FA(true);
        }
      } else {
        try {
          // Store user data directly in browser storage
          const userJson = JSON.stringify(userData);
          
          // Store in both localStorage for persistent logins and sessionStorage for current session
          localStorage.setItem('cosmic_user_data', userJson);
          sessionStorage.setItem('currentUser', userJson);
          
          // If we have a JWT token, store it
          if (token) {
            localStorage.setItem('jwt_token', token);
          }
          
          // Update the user in auth context if possible
          if (setUser) {
            setUser(userData);
          }
          
          console.log('User data saved:', userData);
          
          // Clear any 2FA requirements
          window.sessionStorage.removeItem('requires2FA');
          
          // Store remember me preference if selected
          if (loginForm.getValues().rememberMe) {
            localStorage.setItem('rememberLogin', 'true');
          } else {
            localStorage.removeItem('rememberLogin');
          }
          
          // Redirect to home page
          window.location.href = '/';
        } catch (error) {
          console.error('Error saving user data:', error);
          alert('Login was successful but there was an error saving your session. Please try again.');
        }
      }
    },
    onError: (error: any) => {
      // Handle login error
      console.error('Login failed:', error);
      
      // Get error message from error object or use a default message
      const errorMessage = error?.message || 'An error occurred during login. Please try again.';
      
      // Display error message to the user
      alert(`Login failed: ${errorMessage}`);
    }
  });


  // Check if "Remember me" was previously selected
  const wasRememberMeSelected = () => {
    return localStorage.getItem('rememberLogin') === 'true';
  };

  const loginForm = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
      rememberMe: wasRememberMeSelected() // Use the previously saved preference
    }
  });

  const registerForm = useForm<ContactForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  // If user is already authenticated, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handle2FASuccess = (userData: any) => {
    // The user is now fully authenticated
    console.log("2FA verification successful", userData);
    
    // Store user data in localStorage for the auth system
    localStorage.setItem('cosmic_user_data', JSON.stringify(userData));
    
    // Also update session storage for immediate use
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.removeItem('requires2FA');
    
    // Update the user in auth context if possible
    if (setUser) {
      setUser(userData);
    }
    
    // Clear 2FA requirement from context
    if (setRequires2FA) {
      setRequires2FA(false);
    }
    
    // Redirect to home after 2FA
    window.location.href = '/';
  };

  const handle2FACancel = () => {
    // User canceled the 2FA verification
    sessionStorage.removeItem('requires2FA');
    // Remove the requires2FA state to go back to login form
    if (setRequires2FA) {
      setRequires2FA(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Show 2FA verification if needed
  if (requires2FA) {
    return (
      <div className="container mx-auto py-16 px-4">
        <TwoFactorAuth 
          onSuccess={handle2FASuccess} 
          onCancel={handle2FACancel} 
        />
      </div>
    );
  }

  // Show login/register forms
  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <div>
          <h2 className="text-2xl font-bold text-[#00ebd6] mb-6">Login</h2>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(data => loginMutation.mutate({...data, rememberMe: Boolean(data.rememberMe)}))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input
                  {...loginForm.register("username")}
                  className="w-full p-2 rounded bg-[rgba(48,52,54,0.5)] border-[#00ebd6]"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Input
                    {...loginForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 rounded bg-[rgba(48,52,54,0.5)] border-[#00ebd6]"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...loginForm.register("rememberMe")}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <div className="flex justify-between items-center">
                <Link href="/recover-password" className="text-sm text-[#00ebd6] hover:text-[#fe0064]">
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#00ebd6] text-[#303436] hover:bg-[#fe0064] hover:text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                <ShieldCheck className="h-4 w-4 mr-2 text-[#00ebd6]" />
                <span>This site supports two-factor authentication for enhanced security</span>
              </div>
            </form>
          </Form>
        </div>

        {/* Registration Form */}
        <div>
          <h2 className="text-2xl font-bold text-[#00ebd6] mb-6">Register</h2>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(async (data) => {
              try {
                // Use JWT registration endpoint instead of apiRequest
                const response = await fetch('/api/jwt/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                  }),
                  credentials: 'include' // Important: Include credentials for cookies
                });
                
                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || 'Registration failed');
                }
                
                // Success - show message and reset form
                alert('Registration successful! Please log in.');
                registerForm.reset();
              } catch (error) {
                console.error('Registration failed:', error);
                alert('Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
              }
            })} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input
                  {...registerForm.register("username")}
                  className="w-full p-2 rounded bg-[rgba(48,52,54,0.5)] border-[#00ebd6]"
                  placeholder="Choose a username"
                />
                {registerForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  {...registerForm.register("email")}
                  type="email"
                  className="w-full p-2 rounded bg-[rgba(48,52,54,0.5)] border-[#00ebd6]"
                  placeholder="Enter your email"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Password</label>
                  <Dialog open={isPasswordReqOpen} onOpenChange={setIsPasswordReqOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-transparent focus:bg-transparent relative z-50"
                        onClick={() => setIsPasswordReqOpen(true)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-[#00ebd6]">Password Requirements</DialogTitle>
                        <DialogDescription>
                          Your password must meet the following criteria:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="bg-[rgba(48,52,54,0.95)] p-4 rounded-lg">
                        <ul className="space-y-2">
                          {passwordRules.map((rule, index) => (
                            <li key={index} className="flex items-center text-sm">
                              {rule.regex.test(registerForm.watch("password")) ? (
                                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              )}
                              <span
                                className={`${
                                  rule.regex.test(registerForm.watch("password"))
                                    ? "text-green-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {rule.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setIsPasswordReqOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Input
                    {...registerForm.register("password", {
                      onChange: handlePasswordChange
                    })}
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 rounded bg-[rgba(48,52,54,0.5)] border-[#00ebd6]"
                    placeholder="Choose a password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                )}
                <div className="mt-2">
                  <Progress value={passwordStrength * 25} className={`h-2 ${passwordStrengthColor[passwordStrength as keyof typeof passwordStrengthColor]}`} />
                  <p className="text-sm mt-1 text-gray-400">
                    Password Strength: {passwordStrengthText[passwordStrength as keyof typeof passwordStrengthText]}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Input
                    {...registerForm.register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full p-2 rounded bg-[rgba(48,52,54,0.5)] border-[#00ebd6]"
                    placeholder="Confirm your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#00ebd6] text-[#303436] hover:bg-[#fe0064] hover:text-white"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              <p className="text-sm text-center text-gray-500 mt-4">
                After registering, you'll have the option to enable two-factor authentication in your account settings for added security.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}