import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepContainer } from "./StepContainer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { OnboardingStepProps } from "./AddressStep";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

const idDocumentSchema = z.object({
  idType: z.string({ required_error: "Please select an ID type." }),
  idNumber: z.string().min(1, "ID number is required."),
  expiryDate: z.date().optional(),
  idUpload: z.any().refine(files => files?.length === 1, "A document is required."),
}).refine(data => {
    if (data.idType && data.idType !== 'Birth Certificate') {
        return !!data.expiryDate;
    }
    return true;
}, {
    message: "Expiry date is required for this ID type.",
    path: ["expiryDate"],
});

const formSchema = z.object({
  firstId: idDocumentSchema,
  secondId: idDocumentSchema,
});

const idTypes = ["ID Card", "Driver's Permit", "Passport", "Birth Certificate"];

const IdDocumentForm = ({ form, namePrefix, title }: { form: any, namePrefix: "firstId" | "secondId", title: string }) => {
  const idType = useWatch({ control: form.control, name: `${namePrefix}.idType` });
  const isExpiryDisabled = idType === 'Birth Certificate';

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">{title}</h3>
      <FormField control={form.control} name={`${namePrefix}.idType`} render={({ field }) => (
        <FormItem>
          <FormLabel>ID Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger></FormControl>
            <SelectContent>{idTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name={`${namePrefix}.idNumber`} render={({ field }) => (
        <FormItem>
          <FormLabel>ID Number</FormLabel>
          <FormControl><Input placeholder="123456789" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name={`${namePrefix}.expiryDate`} render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Expiry Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isExpiryDisabled}>
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name={`${namePrefix}.idUpload`} render={({ field }) => (
        <FormItem>
          <FormLabel>Upload ID Document</FormLabel>
          <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}

export const IdInformationStep = ({ formData, updateFormData, nextStep, prevStep }: OnboardingStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstId: { ...formData.idInfo?.firstId, expiryDate: formData.idInfo?.firstId?.expiryDate ? new Date(formData.idInfo.firstId.expiryDate) : undefined, idUpload: null },
      secondId: { ...formData.idInfo?.secondId, expiryDate: formData.idInfo?.secondId?.expiryDate ? new Date(formData.idInfo.secondId.expiryDate) : undefined, idUpload: null }
    },
  });

  const processIdDocument = async (user: any, idData: z.infer<typeof idDocumentSchema>, order: number) => {
    const file = idData.idUpload[0];
    const filePath = `${user.id}/${formData.signupId}/${Date.now()}_id${order}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage.from('id_documents').upload(filePath, file);
    if (uploadError) throw new Error(`Failed to upload document ${order}: ${uploadError.message}`);

    const { data: identData, error: identError } = await supabase.from('identifications').insert({
      user_id: user.id,
      signup_id: formData.signupId,
      id_type: idData.idType,
      id_number: idData.idNumber,
      expiry_date: idData.expiryDate?.toISOString().split('T')[0],
      document_order: order,
    }).select().single();
    if (identError || !identData) throw new Error(`Failed to save ID record ${order}: ${identError?.message}`);

    const { error: fileError } = await supabase.from('id_files').insert({
      user_id: user.id,
      signup_id: formData.signupId,
      identification_id: identData.id,
      file_name: file.name,
      file_path: filePath,
      file_type: file.type,
    });
    if (fileError) throw new Error(`Failed to save ID file record ${order}: ${fileError.message}`);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("You must be logged in to continue.");
      setIsSubmitting(false);
      return;
    }

    try {
      await processIdDocument(user, data.firstId, 1);
      await processIdDocument(user, data.secondId, 2);

      const persistentData = {
        firstId: { ...data.firstId, idUpload: data.firstId.idUpload[0].name },
        secondId: { ...data.secondId, idUpload: data.secondId.idUpload[0].name },
      };
      updateFormData({ idInfo: persistentData });
      nextStep();
    } catch (error: any) {
      showError(error.message);
      // Note: A robust implementation would also clean up any partially uploaded files or created records.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StepContainer title="ID Information" description="Please provide two identification documents." onNext={form.handleSubmit(onSubmit)} onBack={prevStep} isSubmitting={isSubmitting}>
      <Form {...form}>
        <div className="space-y-8">
          <IdDocumentForm form={form} namePrefix="firstId" title="First ID Document" />
          <IdDocumentForm form={form} namePrefix="secondId" title="Second ID Document" />
        </div>
      </Form>
    </StepContainer>
  );
};