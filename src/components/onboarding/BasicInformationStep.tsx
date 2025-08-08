import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { countries } from "@/lib/countries";
import { Combobox } from "@/components/ui/combobox";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { OnboardingStepProps } from "./AddressStep";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  email: z.string().email("Invalid email address."),
  mobileNumber: z.string().min(10, "Please enter a valid mobile number."),
  schoolName: z.string().optional(),
  nationality: z.string({ required_error: "Nationality is required." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const calculateAge = (birthDate: Date) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const countryOptions = countries.map(country => ({
  value: country,
  label: country,
}));

export const BasicInformationStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData.basicInfo,
      dateOfBirth: formData.basicInfo?.dateOfBirth ? new Date(formData.basicInfo.dateOfBirth) : undefined,
    },
  });

  const dateOfBirth = form.watch('dateOfBirth');
  const password = form.watch('password');

  const isUnder18 = dateOfBirth ? calculateAge(dateOfBirth) < 18 : false;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          signup_id: formData.signupId,
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth.toISOString().split('T')[0],
          mobile_number: data.mobileNumber,
          school_name: data.schoolName,
          nationality: data.nationality,
        }
      }
    });

    if (authError) {
      showError(authError.message);
      setIsSubmitting(false);
      return;
    }

    if (authData.user) {
        showSuccess("Account created! Please check your email to verify.");
        updateFormData({ basicInfo: data, userId: authData.user.id });
        nextStep();
    } else {
      showError("An unexpected error occurred during signup.");
    }
    setIsSubmitting(false);
  };

  return (
    <StepContainer title="Basic Information" description="Please provide your personal details." onNext={form.handleSubmit(onSubmit)} onBack={prevStep} isSubmitting={isSubmitting}>
      <Form {...form}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl><Input placeholder="John" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="middleName" render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (Optional)</FormLabel>
              <FormControl><Input placeholder="F." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />

          {isUnder18 && (
            <FormField control={form.control} name="schoolName" render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl><Input placeholder="Springfield Elementary" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="mobileNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl><Input type="tel" placeholder="123-456-7890" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="nationality" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Combobox
                  options={countryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select nationality..."
                  searchPlaceholder="Search for a nationality..."
                  emptyMessage="No nationality found."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <PasswordStrengthIndicator password={password} />
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
      </Form>
    </StepContainer>
  );
};