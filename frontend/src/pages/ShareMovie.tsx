import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import useMovie from "@/domain/useMovie";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  movieUrl: z.string().url({
    message: "Must be youtube link",
  }),
});

function ShareMovie() {
  const { toast } = useToast();
  let navigate = useNavigate();

  const { shareMovie } = useMovie();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieUrl: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await shareMovie(data.movieUrl);
      navigate("/", { replace: true });
    } catch (err: any) {
      console.log("onSubmit", err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.response?.data?.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              Share a Youtube movie
            </h5>
            <FormField
              control={form.control}
              name="movieUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Youtube Url
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="url"
                      {...field}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Share</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ShareMovie;
