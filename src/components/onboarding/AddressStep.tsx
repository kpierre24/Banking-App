import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";
import { Combobox } from "@/components/ui/combobox";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

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

const countryOptions = countries.map(country => ({
  value: country,
  label: country,
}));

export const AddressStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData.address,
      addressDocumentUpload: null,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("You must be logged in to continue.");
      setIsSubmitting(false);
      return;
    }

    const file = data.addressDocumentUpload[0];
    const filePath = `${user.id}/${formData.signupId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('address_documents').upload(filePath, file);

    if (uploadError) {
      showError(`Failed to upload document: ${uploadError.message}`);
      setIsSubmitting(false);
      return;
    }

    const { data: addressData, error: addressError } = await supabase.from('addresses').insert({
      user_id: user.id,
      signup_id: formData.signupId,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      country: data.country,
      address_document_type: data.addressDocumentType,
    }).select().single();

    if (addressError || !addressData) {
      showError(`Failed to save address: ${addressError?.message || 'Unknown error'}`);
      await supabase.storage.from('address_documents').remove([filePath]);
      setIsSubmitting(false);
      return;
    }

    const { error: fileError } = await supabase.from('address_files').insert({
      user_id: user.id,
      signup_id: formData.signupId,
      address_id: addressData.id,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type,
    });

    if (fileError) {
      showError(`Failed to save document record: ${fileError.message}`);
      await supabase.from('addresses').delete().eq('id', addressData.id);
      await supabase.storage.from('address_documents').remove([filePath]);
      setIsSubmitting(false);
      return;
    }

    const persistentData = { ...data, addressDocumentUpload: file.name };
    updateFormData({ address: persistentData });
    nextStep();
    setIsSubmitting(false);
  };

  return (
    <StepContainer title="Mailing Address" description="Where should we send your mail?" onNext={form.handleSubmit(onSubmit)} onBack={prevStep} isSubmitting={isSubmitting}>
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
              <FormItem className="flex flex-col">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Combobox
                    options={countryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select country..."
                    searchPlaceholder="Search for a country..."
                    emptyMessage="No country found."
                  />
                </FormControl>
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