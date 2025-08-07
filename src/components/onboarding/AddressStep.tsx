import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  address1: z.string().min(2, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  addressDocumentType: z.string({ required_error: "Please select a document type." }),
  addressDocumentUpload: z.any().refine(files => files?.length === 1, "A document is required."),
});

export interface OnboardingStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const AddressStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData.address,
      addressDocumentUpload: null, // File inputs cannot be pre-filled for security reasons
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real app, you would upload the file to a server.
    // For this demo, we'll just store the filename.
    const persistentData = {
      ...data,
      addressDocumentUpload: data.addressDocumentUpload[0].name,
    };
    updateFormData({ address: persistentData });
    nextStep();
  };

  return (
    <StepContainer title="Mailing Address" description="Where should we send your mail?" onNext={form.handleSubmit(onSubmit)} onBack={prevStep}>
      <Form {...form}>
        <div className="space-y-4">
          <FormField control={form.control} name="address1" render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="address2" render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 (Optional)</FormLabel>
              <FormControl><Input placeholder="Apt 4B" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl><Input placeholder="USA" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="addressDocumentType" render={({ field }) => (
            <FormItem>
              <FormLabel>Address Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="utility-bill">Utility Bill</SelectItem>
                  <SelectItem value="bank-statement">Bank Statement</SelectItem>
                  <SelectItem value="lease-agreement">Lease Agreement</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="addressDocumentUpload" render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Document</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      </Form>
    </StepContainer>
  );
};